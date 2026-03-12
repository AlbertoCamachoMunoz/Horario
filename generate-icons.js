const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgFile = path.join(__dirname, 'app', 'logo.svg');
const out192 = path.join(__dirname, 'app', 'icon-192.png');
const out512 = path.join(__dirname, 'app', 'icon-512.png');

async function generate() {
    try {
        await sharp(svgFile)
            .resize(192, 192)
            .png()
            .toFile(out192);
        console.log('Created icon-192.png');

        await sharp(svgFile)
            .resize(512, 512)
            .png()
            .toFile(out512);
        console.log('Created icon-512.png');
    } catch (e) {
        console.error(e);
    }
}
generate();
