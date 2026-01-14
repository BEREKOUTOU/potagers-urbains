import pkg from 'pg';
const { Pool } = pkg;

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'green_city_grow_hub',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
  });

  try {
    console.log('Connecting to PostgreSQL database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        profile_picture_url VARCHAR(255),
        bio TEXT,
        location VARCHAR(100),
        region VARCHAR(100),
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin'))
      );
    `);

    // Create gardens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gardens (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        region VARCHAR(100) NOT NULL,
        description TEXT,
        max_members INTEGER NOT NULL,
        crops TEXT[], -- Array of crop types
        features TEXT[], -- Array of features
        rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
        image_url VARCHAR(255),
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create user_gardens table (Junction for Memberships)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_gardens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        garden_id INTEGER NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'coordinator', 'admin')),
        is_active BOOLEAN DEFAULT TRUE,
        UNIQUE(user_id, garden_id)
      );
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        location VARCHAR(255),
        garden_id INTEGER REFERENCES gardens(id) ON DELETE CASCADE,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        max_attendees INTEGER,
        event_type VARCHAR(50) DEFAULT 'general' CHECK (event_type IN ('workshop', 'harvest', 'meeting', 'general')),
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create event_attendees table (Junction for Event Participation)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_attendees (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('attending', 'maybe', 'declined', 'pending')),
        rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    `);

    // Create discussions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS discussions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        garden_id INTEGER REFERENCES gardens(id) ON DELETE CASCADE,
        category VARCHAR(50) DEFAULT 'general',
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create discussion_replies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS discussion_replies (
        id SERIAL PRIMARY KEY,
        discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        parent_reply_id INTEGER REFERENCES discussion_replies(id) ON DELETE CASCADE, -- For nested replies
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        content TEXT,
        resource_type VARCHAR(50) DEFAULT 'article' CHECK (resource_type IN ('article', 'video', 'guide', 'tool')),
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_published BOOLEAN DEFAULT TRUE
      );
    `);

    // Create guides table (Detailed Guides Linked to Resources)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        step_number INTEGER,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        garden_id INTEGER REFERENCES gardens(id) ON DELETE SET NULL,
        tags TEXT[],
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_public BOOLEAN DEFAULT TRUE
      );
    `);

    // Create stats table (Aggregated Data)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        garden_id INTEGER REFERENCES gardens(id) ON DELETE CASCADE,
        stat_type VARCHAR(50) NOT NULL, -- e.g., 'harvest_yield', 'member_count'
        value DECIMAL(10,2),
        unit VARCHAR(20),
        recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        recorded_by INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    console.log('Tables created successfully');

    // Create indexes for performance
    console.log('Creating indexes...');

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_gardens_region ON gardens(region);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_gardens_created_by ON gardens(created_by);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_gardens_user_id ON user_gardens(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_gardens_garden_id ON user_gardens(garden_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_garden_id ON events(garden_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_discussions_garden_id ON discussions(garden_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_photos_garden_id ON photos(garden_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_photos_upload_date ON photos(upload_date);`);

    console.log('Indexes created successfully');

    // Insert sample data
    console.log('Inserting sample data...');

    // Insert sample users and get their IDs
    const bcrypt = await import('bcryptjs');
    const saltRounds = 12;
    const hashedPassword1 = await bcrypt.default.hash('password123', saltRounds);
    const hashedPassword2 = await bcrypt.default.hash('password123', saltRounds);
    const hashedPassword3 = await bcrypt.default.hash('password123', saltRounds);

    // Insert users one by one to handle conflicts properly
    let aliceId, bobId, charlieId;

    const aliceResult = await pool.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, location, region, bio)
      VALUES ('alice_gardener', 'alice@example.com', $1, 'Alice', 'Dupont', 'Paris', 'Île-de-France', 'Passionate urban gardener')
      ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `, [hashedPassword1]);
    aliceId = aliceResult.rows[0].id;

    const bobResult = await pool.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, location, region, bio)
      VALUES ('bob_farmer', 'bob@example.com', $1, 'Bob', 'Martin', 'Lyon', 'Auvergne-Rhône-Alpes', 'Experienced in permaculture')
      ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `, [hashedPassword2]);
    bobId = bobResult.rows[0].id;

    const charlieResult = await pool.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, location, region, bio)
      VALUES ('charlie_green', 'charlie@example.com', $1, 'Charlie', 'Leroy', 'Marseille', 'Provence-Alpes-Côte d''Azur', 'Community garden coordinator')
      ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `, [hashedPassword3]);
    charlieId = charlieResult.rows[0].id;

    // Insert sample gardens using the actual user IDs
    const garden1Result = await pool.query(`
      INSERT INTO gardens (name, location, region, description, max_members, crops, features, rating, image_url, created_by)
      VALUES ('Jardin du Marais', '15 rue Cardinet, 75017 Paris', 'Île-de-France', 'Jardin communautaire en plein cœur du Marais, spécialisé dans les légumes anciens.', 15, ARRAY['Légumes', 'Herbes'], ARRAY['Bio', 'Permaculture'], 4.8, '/assets/garden-01.jpg', $1)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [aliceId]);
    const garden1Id = garden1Result.rows.length > 0 ? garden1Result.rows[0].id : null;

    const garden2Result = await pool.query(`
      INSERT INTO gardens (name, location, region, description, max_members, crops, features, rating, image_url, created_by)
      VALUES ('Balcon Vert Belleville', '32 rue de Belleville, 75020 Paris', 'Île-de-France', 'Espace de jardinage partagé sur les toits de Belleville.', 10, ARRAY['Herbes', 'Fleurs'], ARRAY['Urbain', 'Éducatif'], 4.6, '/assets/garden-02.jpg', $1)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [bobId]);
    const garden2Id = garden2Result.rows.length > 0 ? garden2Result.rows[0].id : null;

    const garden3Result = await pool.query(`
      INSERT INTO gardens (name, location, region, description, max_members, crops, features, rating, image_url, created_by)
      VALUES ('Jardin des Batignolles', 'Paris 17ème', 'Île-de-France', 'Jardin communautaire urbain en plein cœur des Batignolles.', 30, ARRAY['Légumes', 'Herbes aromatiques', 'Fleurs'], ARRAY['Jardin partagé', 'Actif', 'Communautaire'], 4.8, '/assets/garden-01.jpg', $1)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [charlieId]);
    const garden3Id = garden3Result.rows.length > 0 ? garden3Result.rows[0].id : null;

    // Insert sample user_gardens if gardens were created
    if (garden1Id) {
      await pool.query(`
        INSERT INTO user_gardens (user_id, garden_id, role) VALUES ($1, $2, 'coordinator')
        ON CONFLICT (user_id, garden_id) DO NOTHING
      `, [aliceId, garden1Id]);
    }

    if (garden2Id) {
      await pool.query(`
        INSERT INTO user_gardens (user_id, garden_id, role) VALUES ($1, $2, 'member')
        ON CONFLICT (user_id, garden_id) DO NOTHING
      `, [bobId, garden2Id]);
    }

    if (garden3Id) {
      await pool.query(`
        INSERT INTO user_gardens (user_id, garden_id, role) VALUES ($1, $2, 'admin')
        ON CONFLICT (user_id, garden_id) DO NOTHING
      `, [charlieId, garden3Id]);
    }

    // Insert sample events if gardens exist
    if (garden1Id) {
      await pool.query(`
        INSERT INTO events (title, description, start_date, end_date, location, garden_id, created_by, max_attendees, event_type)
        VALUES ('Atelier Compostage', 'Apprenez à faire votre compost à la maison', '2024-06-15 14:00:00', '2024-06-15 16:00:00', 'Jardin du Marais', $1, $2, 20, 'workshop')
        ON CONFLICT DO NOTHING
      `, [garden1Id, aliceId]);
    }

    if (garden2Id) {
      await pool.query(`
        INSERT INTO events (title, description, start_date, end_date, location, garden_id, created_by, max_attendees, event_type)
        VALUES ('Récolte Collective', 'Venez récolter les légumes du jardin', '2024-07-01 09:00:00', '2024-07-01 12:00:00', 'Balcon Vert Belleville', $1, $2, 15, 'harvest')
        ON CONFLICT DO NOTHING
      `, [garden2Id, bobId]);
    }

    // Insert sample discussions if gardens exist
    if (garden1Id) {
      await pool.query(`
        INSERT INTO discussions (title, content, author_id, garden_id, category)
        VALUES ('Conseils pour les tomates', 'Quelles variétés recommandez-vous pour Paris?', $1, $2, 'advice')
        ON CONFLICT DO NOTHING
      `, [aliceId, garden1Id]);
    }

    if (garden2Id) {
      await pool.query(`
        INSERT INTO discussions (title, content, author_id, garden_id, category)
        VALUES ('Échange de graines', 'Qui a des graines de basilic à partager?', $1, $2, 'exchange')
        ON CONFLICT DO NOTHING
      `, [bobId, garden2Id]);
    }

    // Insert sample resources
    await pool.query(`
      INSERT INTO resources (title, description, content, resource_type, author_id, tags)
      VALUES ('Guide du Jardinage Bio', 'Introduction complète au jardinage biologique', 'Contenu détaillé...', 'guide', $1, ARRAY['bio', 'débutant'])
      ON CONFLICT DO NOTHING
    `, [aliceId]);

    await pool.query(`
      INSERT INTO resources (title, description, content, resource_type, author_id, tags)
      VALUES ('Vidéo: Plantation d''Herbes Aromatiques', 'Tutoriel vidéo pour planter des herbes', 'URL de la vidéo...', 'video', $1, ARRAY['herbes', 'tutoriel'])
      ON CONFLICT DO NOTHING
    `, [bobId]);

    // Insert sample photos if gardens exist
    if (garden1Id) {
      await pool.query(`
        INSERT INTO photos (title, description, image_url, uploaded_by, garden_id, tags)
        VALUES ('Récolte d''été', 'Première récolte de tomates', '/assets/harvest-1.jpg', $1, $2, ARRAY['récolte', 'tomates'])
        ON CONFLICT DO NOTHING
      `, [aliceId, garden1Id]);
    }

    if (garden2Id) {
      await pool.query(`
        INSERT INTO photos (title, description, image_url, uploaded_by, garden_id, tags)
        VALUES ('Fleurs au balcon', 'Belle floraison sur le balcon', '/assets/garden-22.jpg', $1, $2, ARRAY['fleurs', 'balcon'])
        ON CONFLICT DO NOTHING
      `, [bobId, garden2Id]);
    }

    console.log('Sample data inserted successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
    console.log('Database setup complete');
  }
}

setupDatabase();
