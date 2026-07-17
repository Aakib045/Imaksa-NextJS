import sharp from 'sharp';

await sharp('public/new.jpg')
  .resize(32, 32)
  .png()
  .toFile('public/favicon-32.png');

await sharp('public/new.jpg')
  .resize(16, 16)
  .png()
  .toFile('public/favicon-16.png');

await sharp('public/new.jpg')
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png');

console.log('Favicons created!');
