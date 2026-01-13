import { useTheme } from '../../context/ThemeContext';
import '../../styles/ThemeToggle.css';

function ThemeToggle() {
  const { palette, togglePalette } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={togglePalette}
      aria-label="Toggle color palette"
      title={`Current: ${palette === 'mutedLinen' ? 'Muted Linen' : palette === 'warmOat' ? 'Warm Oat' : 'Blush Parchment'}`}
    >
      <span className="theme-toggle-icon">🎨</span>
    </button>
  );
}

export default ThemeToggle;

