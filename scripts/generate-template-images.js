const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const templates = [
  { name: 'modern-minimal', color: '#4F46E5' },
  { name: 'creative-professional', color: '#EC4899' },
  { name: 'tech-focused', color: '#3B82F6' },
  { name: 'corporate-professional', color: '#10B981' },
  { name: 'tech-developer', color: '#F59E0B' },
  { name: 'resume-style', color: '#8B5CF6' }
];

const width = 800;
const height = 600;

templates.forEach(template => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(0, 0, width, height);

  // Draw template preview
  ctx.fillStyle = template.color;
  ctx.fillRect(50, 50, width - 100, height - 100);

  // Add template name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(template.name.replace(/-/g, ' ').toUpperCase(), width / 2, height / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/templates', `${template.name}.png`), buffer);
}); 