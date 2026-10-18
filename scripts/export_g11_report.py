"""Export the synthetic G11 parent report without questionnaire or scoring code."""
from pathlib import Path
import subprocess
root = Path(__file__).resolve().parent.parent
subprocess.run(['node', str(root / 'scripts/export_parent_report.js')], cwd=root, check=True)
