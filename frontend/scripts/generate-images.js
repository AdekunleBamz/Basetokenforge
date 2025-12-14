const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Colors
const colors = {
  dark: '#0A0B0D',
  gray: '#1E2025',
  orange: '#FF6B35',
  gold: '#F7C948',
  blue: '#0052FF',
  white: '#FFFFFF',
};

// Generate icon.png (200x200)
function generateIcon() {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Background with gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 200, 200);
  bgGrad.addColorStop(0, colors.dark);
  bgGrad.addColorStop(1, colors.gray);
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 200, 200, 40);
  ctx.fill();

  // Flame
  const flameGrad = ctx.createLinearGradient(100, 40, 100, 90);
  flameGrad.addColorStop(0, colors.orange);
  flameGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.ellipse(100, 65, 20, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Token stack (3 coins)
  const coinGrad = ctx.createLinearGradient(50, 100, 150, 160);
  coinGrad.addColorStop(0, colors.orange);
  coinGrad.addColorStop(1, colors.gold);

  // Bottom coin
  ctx.fillStyle = colors.orange;
  ctx.beginPath();
  ctx.ellipse(100, 150, 50, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Middle coin
  ctx.fillStyle = colors.gold;
  ctx.beginPath();
  ctx.ellipse(100, 130, 50, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Top coin
  ctx.fillStyle = coinGrad;
  ctx.beginPath();
  ctx.ellipse(100, 110, 50, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'icon.png'), buffer);
  console.log('✓ Generated icon.png (200x200)');
}

// Generate splash.png (200x200)
function generateSplash() {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = colors.dark;
  ctx.fillRect(0, 0, 200, 200);

  // Glowing icon background
  ctx.shadowColor = colors.orange;
  ctx.shadowBlur = 30;
  const iconGrad = ctx.createLinearGradient(60, 50, 140, 130);
  iconGrad.addColorStop(0, colors.orange);
  iconGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = iconGrad;
  ctx.beginPath();
  ctx.roundRect(60, 50, 80, 80, 20);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Fire emoji/icon
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🔥', 100, 105);

  // Text
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Token Forge', 100, 160);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'splash.png'), buffer);
  console.log('✓ Generated splash.png (200x200)');
}

// Generate og-image.png (1200x630)
function generateOgImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, colors.dark);
  bgGrad.addColorStop(0.5, colors.gray);
  bgGrad.addColorStop(1, colors.dark);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Glow effect
  ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
  ctx.beginPath();
  ctx.ellipse(600, 315, 400, 250, 0, 0, Math.PI * 2);
  ctx.fill();

  // Icon
  ctx.shadowColor = colors.orange;
  ctx.shadowBlur = 40;
  const iconGrad = ctx.createLinearGradient(540, 120, 660, 200);
  iconGrad.addColorStop(0, colors.orange);
  iconGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = iconGrad;
  ctx.beginPath();
  ctx.roundRect(550, 130, 100, 100, 24);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Fire emoji
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🔥', 600, 200);

  // Title
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 64px Arial';
  ctx.fillText('Base Token Forge', 600, 300);

  // Subtitle with gradient effect
  ctx.fillStyle = colors.orange;
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Create ERC20 Tokens in Seconds', 600, 360);

  // Stats
  ctx.font = 'bold 36px Arial';
  
  // Gas cost
  ctx.fillStyle = colors.white;
  ctx.fillText('~$0.01', 300, 480);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '18px Arial';
  ctx.fillText('Gas Cost', 300, 510);

  // Deploy time
  ctx.fillStyle = colors.orange;
  ctx.font = 'bold 36px Arial';
  ctx.fillText('<10s', 600, 480);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '18px Arial';
  ctx.fillText('Deploy Time', 600, 510);

  // Network
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 36px Arial';
  ctx.fillText('Base', 900, 480);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '18px Arial';
  ctx.fillText('Mainnet', 900, 510);

  // Base badge
  ctx.fillStyle = 'rgba(0, 82, 255, 0.2)';
  ctx.beginPath();
  ctx.roundRect(480, 560, 240, 40, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 82, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = colors.blue;
  ctx.beginPath();
  ctx.arc(510, 580, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colors.blue;
  ctx.font = '16px Arial';
  ctx.fillText('Live on Base Mainnet', 600, 586);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), buffer);
  console.log('✓ Generated og-image.png (1200x630)');
}

// Generate screenshot.png (1284x2778 - iPhone size)
function generateScreenshot() {
  const canvas = createCanvas(1284, 2778);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 2778);
  bgGrad.addColorStop(0, colors.dark);
  bgGrad.addColorStop(1, colors.gray);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1284, 2778);

  // Header
  const headerGrad = ctx.createLinearGradient(100, 100, 200, 180);
  headerGrad.addColorStop(0, colors.orange);
  headerGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = headerGrad;
  ctx.beginPath();
  ctx.roundRect(60, 80, 80, 80, 20);
  ctx.fill();

  ctx.font = '40px Arial';
  ctx.fillText('🔥', 80, 135);

  ctx.fillStyle = colors.white;
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Token Forge', 160, 115);
  ctx.fillStyle = colors.orange;
  ctx.font = '20px Arial';
  ctx.fillText('Base Mainnet', 160, 145);

  // Connect button
  ctx.textAlign = 'center';
  const btnGrad = ctx.createLinearGradient(950, 95, 1200, 145);
  btnGrad.addColorStop(0, colors.orange);
  btnGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = btnGrad;
  ctx.beginPath();
  ctx.roundRect(950, 95, 200, 55, 14);
  ctx.fill();
  ctx.fillStyle = colors.dark;
  ctx.font = 'bold 22px Arial';
  ctx.fillText('Connected', 1050, 132);

  // Badge
  ctx.fillStyle = 'rgba(0, 82, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(450, 220, 384, 50, 25);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 82, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.fillStyle = colors.blue;
  ctx.beginPath();
  ctx.arc(490, 245, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '20px Arial';
  ctx.fillText('Live on Base Mainnet', 642, 252);

  // Hero text
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 72px Arial';
  ctx.fillText('Forge Your', 642, 400);
  
  const titleGrad = ctx.createLinearGradient(200, 450, 1084, 500);
  titleGrad.addColorStop(0, colors.orange);
  titleGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = titleGrad;
  ctx.fillText('Token Empire', 642, 490);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '28px Arial';
  ctx.fillText('Deploy ERC20 tokens on Base in seconds', 642, 560);

  // Form card
  ctx.fillStyle = 'rgba(30, 32, 37, 0.9)';
  ctx.beginPath();
  ctx.roundRect(80, 650, 1124, 1100, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Form title
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 40px Arial';
  ctx.fillText('Create Your Token', 642, 740);

  // Input fields
  const inputY = [830, 1000, 1170, 1340];
  const labels = ['Token Name', 'Token Symbol', 'Decimals', 'Total Supply'];
  const placeholders = ['e.g., My Awesome Token', 'e.g., MAT', '18 (Standard)', '1,000,000'];

  inputY.forEach((y, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '22px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(labels[i], 140, y);

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(140, y + 15, 1004, 70, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '22px Arial';
    ctx.fillText(placeholders[i], 170, y + 60);
  });

  // Fee box
  ctx.fillStyle = 'rgba(255, 107, 53, 0.1)';
  ctx.beginPath();
  ctx.roundRect(140, 1500, 1004, 70, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Creation Fee', 170, 1545);
  ctx.fillStyle = colors.orange;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('0.00015 ETH', 1114, 1545);

  // Forge button
  ctx.textAlign = 'center';
  const forgeBtnGrad = ctx.createLinearGradient(140, 1620, 1144, 1700);
  forgeBtnGrad.addColorStop(0, colors.orange);
  forgeBtnGrad.addColorStop(1, colors.gold);
  ctx.fillStyle = forgeBtnGrad;
  ctx.beginPath();
  ctx.roundRect(140, 1620, 1004, 80, 14);
  ctx.fill();

  ctx.fillStyle = colors.dark;
  ctx.font = 'bold 28px Arial';
  ctx.fillText('🔥 Forge Token', 642, 1672);

  // Stats at bottom
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 44px Arial';
  ctx.fillText('~$0.01', 250, 1950);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '20px Arial';
  ctx.fillText('Gas Cost', 250, 1990);

  ctx.fillStyle = colors.orange;
  ctx.font = 'bold 44px Arial';
  ctx.fillText('<10s', 642, 1950);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '20px Arial';
  ctx.fillText('Deploy Time', 642, 1990);

  ctx.fillStyle = colors.white;
  ctx.font = 'bold 44px Arial';
  ctx.fillText('100%', 1034, 1950);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '20px Arial';
  ctx.fillText('On-chain', 1034, 1990);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'screenshot.png'), buffer);
  console.log('✓ Generated screenshot.png (1284x2778)');
}

// Generate all images
console.log('Generating Farcaster images...\n');
generateIcon();
generateSplash();
generateOgImage();
generateScreenshot();
console.log('\n✅ All images generated in public/ folder');

