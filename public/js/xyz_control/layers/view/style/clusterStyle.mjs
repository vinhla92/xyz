export default _xyz => (layer, style, title) => {

  title && layer.style.legend.appendChild(_xyz.utils.wire()`
  <div class="title secondary-colour-bg">${title}`);

  const block = {};

  block.node = _xyz.utils.wire()`<div class="block">`;

  layer.style.legend.appendChild(block.node);

  block.fill_colour = _xyz.utils.wire()`<div>Fill Colour `;

  block.node.appendChild(block.fill_colour);

  block.fillColor = _xyz.utils.wire()`
  <span
    class="cursor primary-colour"
    onclick=${e => {
        block.colorSelect = 'fillColor';
        block.colour_swatch.style.display = 'table';
    }}>${style.fillColor}`;

  block.fill_colour.appendChild(block.fillColor);

  block.sample = _xyz.utils.wire()`<div class="sample-circle">`;

  block.sample.style.backgroundColor = style.fillColor && _xyz.utils.Chroma(style.fillColor).alpha(1).hex();

  block.node.appendChild(block.sample);

  block.node.appendChild(_xyz.utils.wire()`<br>`);

  block.colour_swatch = _xyz.utils.wire()`
  <tr
    class="colour-swatch"
    style="display: none;">`;

  block.node.appendChild(block.colour_swatch);

  _xyz.defaults.colours.forEach(colour => {

    block.colour_swatch.appendChild(_xyz.utils.wire()`
    <td class="colour-td"
      title="${colour.name}"
      style="${'background-color:'+colour.hex}"
      onclick=${e => {

        block[block.colorSelect].textContent = colour.hex;

        style[block.colorSelect] = colour.hex;

        block.sample.style.backgroundColor = _xyz.utils.Chroma(style.fillColor).alpha(1).hex();

        block.colour_swatch.style.display = 'none';

        layer.reload();

      }}>`);
    
  });

};