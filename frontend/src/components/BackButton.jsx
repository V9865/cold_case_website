import './BackButton.css';

export default function BackButton({ onClick, label = 'BACK' }) {
  return (
    <div className="back-btn group" onClick={onClick}>
      <button className="back-btn__button" type="button" tabIndex={-1}>
        {/* Left chevron SVG */}
        <svg
          className="back-btn__icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4L6 8L10 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Label */}
        <span className="back-btn__label">{label}</span>
      </button>
    </div>
  );
}
