#!/bin/bash
echo "1. Mapping Template..."
node scripts/map-template.js

echo "2. Building Site..."
node scripts/build-site.js

echo "3. Replacing Kanji..."
node scripts/replace-kanji.js

echo "4. Replacing Hero Logo..."
node scripts/replace-hero-logo.js

echo "5. Replacing Scroll Text..."
node scripts/replace-scroll-text.js

echo "6. Replacing Service Banner..."
node scripts/replace-service-banner.js

echo "7. Deploying to saisei-nextjs..."
cp src/app/page.tsx ../saisei-nextjs/src/app/page.tsx
echo "Deployed successfully!"
