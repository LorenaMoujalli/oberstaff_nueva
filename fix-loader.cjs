const fs = require('fs');
const path = require('path');

const layoutsDir = 'c:\\\\Users\\\\EQUIPO\\\\Desktop\\\\oberstaff_nueva\\\\oberstaff\\\\src\\\\layouts';
const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.astro'));

const styleRegex = /<!-- Geo-Redirección: Loader Anti-Flash -->[\s\S]*?<\/script>/;
const newStyle = `<!-- Geo-Redirección: Loader Anti-Flash -->
		<style id="geo-loader-style" is:inline>
			html.geo-loading { overflow: hidden !important; }
			html.geo-loading body { visibility: hidden !important; opacity: 0 !important; }
			html.geo-loading::before {
				content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
				background: #ffffff; z-index: 2147483646;
			}
			html.geo-loading::after {
				content: ""; position: fixed; top: calc(50% - 18px); left: calc(50% - 18px);
				width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #111827;
				border-radius: 50%; animation: geo-spin 0.7s linear infinite; z-index: 2147483647;
			}
			@keyframes geo-spin { to { transform: rotate(360deg); } }
		</style>
		<script is:inline>
			(function () {
				var ua = navigator.userAgent || "";
				var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);
				if (!isBot && !sessionStorage.getItem("geo_country")) {
					document.documentElement.classList.add("geo-loading");
				}
			})();
		</script>`;

const removeLoaderRegex = /(\s*)var loaderRemoved = false;[\s\S]*?if \(st\) st\.parentNode\.removeChild\(st\);\s*}/;

files.forEach(file => {
    const filePath = path.join(layoutsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(styleRegex, newStyle);
    
    content = content.replace(removeLoaderRegex, function(match, p1) {
        const ws = p1;
        const baseWs = ws.replace(/\n/g, '');
        return ws + `var loaderRemoved = false;
${baseWs}function removeLoader() {
${baseWs}	if (loaderRemoved) return;
${baseWs}	loaderRemoved = true;
${baseWs}	document.documentElement.classList.remove("geo-loading");
${baseWs}	var st = document.getElementById("geo-loader-style");
${baseWs}	if (st) st.parentNode.removeChild(st);
${baseWs}}`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
});
