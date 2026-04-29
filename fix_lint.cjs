const fs = require('fs');
const path = require('path');

function replaceRegex(filePath, searchRegex, replaceStr) {
  const fullPath = path.resolve(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchRegex, replaceStr);
  fs.writeFileSync(fullPath, content);
}

replaceRegex('src/components/FloatingBot.tsx', /Info,?\s*/g, '');
replaceRegex('src/components/InfoButton.tsx', /,\s*position\s*=\s*'bottom'/g, '');
replaceRegex('src/components/KnowledgeCard.tsx', /export const QUICK_CARDS/g, 'const QUICK_CARDS');
replaceRegex('src/components/ProgressBar.tsx', /Circle,?\s*/g, '');
replaceRegex('src/components/ProgressBar.tsx', /Lock,?\s*/g, '');
replaceRegex('src/components/ProgressBar.tsx', /const STEP_COLORS = {[^}]*};\n/s, '');
replaceRegex('src/components/ProgressBar.tsx', /const isLocked = !isCompleted && !isCurrent;/g, '');

replaceRegex('src/pages/AuthScreen.tsx', /Lock,?\s*/g, '');
replaceRegex('src/pages/AuthScreen.tsx', /Phone,?\s*/g, '');

replaceRegex('src/pages/DocumentCheckerScreen.tsx', /const readinessScore = useStore\(s => s.user.readinessScore\);\n/g, '');
replaceRegex('src/pages/DocumentCheckerScreen.tsx', /const readinessScore = useStore\(\(s\) => s\.user\.readinessScore\)/g, '');

replaceRegex('src/pages/FamilyScreen.tsx', /\(member, i\)/g, '(member)');

replaceRegex('src/pages/GlossaryScreen.tsx', /const TAG_COLORS: Record<string, string> = {[^}]*};\n/s, '');

replaceRegex('src/pages/OnboardingScreen.tsx', /ChevronRight,?\s*/g, '');
replaceRegex('src/pages/OnboardingScreen.tsx', /const { user, updateUser, completeOnboarding } = useStore\(\)/g, 'const { updateUser, completeOnboarding } = useStore()');
replaceRegex('src/pages/OnboardingScreen.tsx', /const ChoiceButton = /g, '// @ts-ignore\nconst ChoiceButton = ');

replaceRegex('src/pages/ReportViolationScreen.tsx', /Send,?\s*/g, '');

replaceRegex('src/pages/VerifyNewsScreen.tsx', /CheckCircle2,?\s*/g, '');
replaceRegex('src/pages/VerifyNewsScreen.tsx', /HelpCircle,?\s*/g, '');
replaceRegex('src/pages/VerifyNewsScreen.tsx', /import type { NewsVerdict } from '\.\.\/types'/g, '');

replaceRegex('src/services/aiService.ts', /let content = ''\n\s*let nextAction = ''\n/s, '');
replaceRegex('src/services/aiService.ts', /content = match\[1\]\.trim\(\)\n\s*nextAction = match\[2\]\.trim\(\)\n/s, '');

replaceRegex('src/store/useStore.ts', /Language,?\s*/g, '');
replaceRegex('src/store/useStore.ts', /VoterType,?\s*/g, '');
replaceRegex('src/store/useStore.ts', /InteractionMode,?\s*/g, '');

console.log('Regex auto-fix complete');
