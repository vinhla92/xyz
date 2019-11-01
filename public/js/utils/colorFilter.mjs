// Create param string for XHR request.
export function colorFilter(_color) {

  const rgb = hexToRgb(_color);
  
  const color = {
    r: clamp(rgb[0]),
    g: clamp(rgb[1]),
    b: clamp(rgb[2])
  };
  
  let target = Object.assign({}, color);
  
  let targetHSL = hsl();
  
  const result = solve();

  return result.filter;
  
  
  function clamp(value) {
    if (value > 255) {
      value = 255;
    } else if (value < 0) {
      value = 0;
    }
    return value;
  }
  
  function hexToRgb(hex) {
  
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ] :
      null;
  }
  
  function hueRotate(angle = 0) {
    angle = angle / 180 * Math.PI;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
  
    multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.140,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ]);
  }
  
  function grayscale(value = 1) {
    multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ]);
  }
  
  function sepia(value = 1) {
    multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ]);
  }
  
  function saturate(value = 1) {
    multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ]);
  }
  
  function multiply(matrix) {
    const newR = clamp(color.r * matrix[0] + color.g * matrix[1] + color.b * matrix[2]);
    const newG = clamp(color.r * matrix[3] + color.g * matrix[4] + color.b * matrix[5]);
    const newB = clamp(color.r * matrix[6] + color.g * matrix[7] + color.b * matrix[8]);
    color.r = newR;
    color.g = newG;
    color.b = newB;
  }
  
  function brightness(value = 1) {
    linear(value);
  }
  
  function contrast(value = 1) {
    linear(value, -(0.5 * value) + 0.5);
  }
  
  function linear(slope = 1, intercept = 0) {
    color.r = clamp(color.r * slope + intercept * 255);
    color.g = clamp(color.g * slope + intercept * 255);
    color.b = clamp(color.b * slope + intercept * 255);
  }
  
  function invert(value = 1) {
    color.r = clamp((value + color.r / 255 * (1 - 2 * value)) * 255);
    color.g = clamp((value + color.g / 255 * (1 - 2 * value)) * 255);
    color.b = clamp((value + color.b / 255 * (1 - 2 * value)) * 255);
  }
  
  function hsl() {
    // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
  
        case g:
          h = (b - r) / d + 2;
          break;
  
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
  
    return {
      h: h * 100,
      s: s * 100,
      l: l * 100,
    };
  }
  
  function solve() {
    const result = solveNarrow(solveWide());
    return {
      values: result.values,
      loss: result.loss,
      filter: css(result.values),
    };
  }
  
  function solveWide() {
    const A = 5;
    const c = 15;
    const a = [60, 180, 18000, 600, 1.2, 1.2];
  
    let best = {
      loss: Infinity
    };
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial = [50, 20, 3750, 50, 100, 100];
      const result = spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }
    }
    return best;
  }
  
  function solveNarrow(wide) {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return spsa(A, a, c, wide.values, 500);
  }
  
  function spsa(A, a, c, values, iters) {
  
    const alpha = 1;
    const gamma = 0.16666666666666666;
  
    let best = null;
    let bestLoss = Infinity;
    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);
  
    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }
  
      const lossDiff = loss(highArgs) - loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = lossDiff / (2 * ck) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = fix(values[i] - ak * g, i);
      }
  
      const _loss = loss(values);
      if (_loss < bestLoss) {
        best = values.slice(0);
        bestLoss = _loss;
      }
    }
    return {
      values: best,
      loss: bestLoss
    };
  
    function fix(value, idx) {
      let max = 100;
      if (idx === 2 /* saturate */ ) {
        max = 7500;
      } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */ ) {
        max = 200;
      }
  
      if (idx === 3 /* hue-rotate */ ) {
        if (value > max) {
          value %= max;
        } else if (value < 0) {
          value = max + value % max;
        }
      } else if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }
      return value;
    }
  }
  
  function loss(filters) {
  
    invert(filters[0] / 100);
    sepia(filters[1] / 100);
    saturate(filters[2] / 100);
    hueRotate(filters[3] * 3.6);
    brightness(filters[4] / 100);
    contrast(filters[5] / 100);
  
    const colorHSL = hsl();
  
    return (
      Math.abs(color.r - target.r) +
      Math.abs(color.g - target.g) +
      Math.abs(color.b - target.b) +
      Math.abs(colorHSL.h - targetHSL.h) +
      Math.abs(colorHSL.s - targetHSL.s) +
      Math.abs(colorHSL.l - targetHSL.l)
    );
  }
  
  function css(filters) {
  
    function fmt(idx, multiplier = 1) {
      return Math.round(filters[idx] * multiplier);
    }
  
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
  
  }

}