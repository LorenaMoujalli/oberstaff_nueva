import fs from 'fs';
import path from 'path';

const files = [
    'src/components/form/ContactForm.astro',
    'src/components/form-contacto/ContactFormCard.astro',
    'src/components/conversion-perfil/ConversionPerfilDisenador.astro',
    'src/components/community-manager/LeadHeroForm.astro',
    'src/components/informes/ContentForm.astro',
    'src/components/informes/ReportWebView.astro',
    'src/pages/cotizar-perfil.astro',
    'src/pages/recursos/calculadora-sobre-costes.astro',
    'src/pages/obertrack/clientes.astro'
];

let updatedCount = 0;

files.forEach((file) => {
    const fullPath = path.resolve('c:/Users/EQUIPO/Desktop/oberstaff_nueva/oberstaff', file);
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const targetStr = "showToast('Ya hemos recibido una solicitud con este correo. Nos pondremos en contacto pronto.', 'success');";
        const replacementStr = `showToast('Ya hemos recibido una solicitud con este correo. Nos pondremos en contacto pronto.', 'success');\n                            (e.target as HTMLFormElement).reset();`;

        if (content.includes(targetStr) && !content.includes(`(e.target as HTMLFormElement).reset();`)) {
            content = content.split(targetStr).join(replacementStr);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${file}`);
            updatedCount++;
        } else {
            console.log(`Target string not found or already updated in ${file}`);
        }
    } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
    }
});

console.log(`Total files updated: ${updatedCount}`);
