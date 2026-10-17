"""Bundle the generated synthetic G11 fixture into a self-contained offline report."""
from pathlib import Path
import re
root = Path(__file__).resolve().parent.parent
folder = root / 'exports/G11-修订验证-20261017'
source = (folder / '报告验证.html').read_text().replace('<base href="../../">', '')
source = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>' + (root / m.group(1).split('?')[0]).read_text() + '</style>', source)
def inline_script(match):
    url = match.group(1)
    if url.startswith('http') or 'analytics.js' in url:
        return ''
    return '<script>' + (root / url.split('?')[0]).read_text().replace('</script', '<\\/script') + '</script>'
source = re.sub(r'<script src="([^"]+)"></script>', inline_script, source)
source = source.replace("document.querySelectorAll('#result details:not(.report-methods)').forEach(d=>d.open=true);", "authSessionBar.classList.add('hidden');")
(folder / 'G11学生专业发展测评报告.html').write_text(source)
print('已生成独立G11模拟报告，未连接真实后台。')
