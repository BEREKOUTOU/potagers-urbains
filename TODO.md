# TODO: Fix process.env ReferenceError in Login.tsx

- [x] Update `handleGoogleLogin` function to use `import.meta.env.VITE_GOOGLE_CLIENT_ID` and `import.meta.env.VITE_GOOGLE_REDIRECT_URI` instead of `process.env.REACT_APP_GOOGLE_CLIENT_ID` and `process.env.REACT_APP_GOOGLE_REDIRECT_URI`
- [x] Update `handleFacebookLogin` function to use `import.meta.env.VITE_FACEBOOK_APP_ID` and `import.meta.env.VITE_FACEBOOK_REDIRECT_URI` instead of `process.env.REACT_APP_FACEBOOK_APP_ID` and `process.env.REACT_APP_FACEBOOK_REDIRECT_URI`
- [x] Add React.FC type annotation and import React to resolve TypeScript error in App.tsx
