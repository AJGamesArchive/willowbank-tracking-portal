// Function to generate badges as SVG vectors
export const generateBadgeSVG = (shape: string, color: string, textColor: string, level: string) => {
    let svg: string = '';
    switch(shape) {
      case "Star":
        svg = `data:image/svg+xml;charset=utf-8,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><polygon points='50,0 62.5,37.5 100,37.5 75,62.5 87.5,100 50,75 12.5,100 25,62.5 0,37.5 37.5,37.5' fill='%23${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${textColor}'>${level}</text></svg>`;
        break;
      case "Circle":
        svg = `data:image/svg+xml;charset=utf-8,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${textColor}'>${level}</text></svg>`;
        break;
      case "Triangle":
        svg = `data:image/svg+xml;charset=utf-8,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><polygon points='50,0 100,100 0,100' fill='%23${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${textColor}'>${level}</text></svg>`;
        break;
      case "Fish":
        svg = `data:image/svg+xml;charset=utf-8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M50,0 Q60,20 80,30 Q60,40 50,60 Q40,40 20,30 Q40,20 50,0" fill="%236ed9f9"/><circle cx="50" cy="50" r="30" fill="%23${color}"/><circle cx="70" cy="30" r="5" fill="white"/><circle cx="70" cy="30" r="2" fill="black"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}">${level}</text></svg>`;
        break;
      default:
        svg = `data:image/svg+xml;charset=utf-8,<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='%23${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${textColor}'>${level}</text></svg>`;
        break;
    };
    return svg;
  };
