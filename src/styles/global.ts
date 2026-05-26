// styles/global.ts
// Keyframes et reset global — injecter une seule fois via <style>

export const GLOBAL_STYLES = `
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    70%  { transform: scale(1.3); opacity: 0;   }
    100% { transform: scale(1.3); opacity: 0;   }
  }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { display: none; }
`;