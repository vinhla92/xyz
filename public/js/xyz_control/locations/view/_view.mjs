import group from './group.mjs';

import streetview from './streetview.mjs';

import images from './images/_images.mjs';

import documents from './documents.mjs';

import geometry from './geometry/_geometry.mjs';

import meta from './meta.mjs';

import edit from './edit/_edit.mjs';

import valChange from './edit/valChange.mjs';

import tableDefinition from './tableDefinition.mjs';

import orderedList from './orderedList.mjs';

import dashboard from './dashboard.mjs';

import report from './report.mjs';

import update from './update.mjs';

import boolean from './boolean.mjs';


export default _xyz => function () {

  const location = this;

  const view = {

    update: update(_xyz, location),

    streetview: streetview(_xyz),
  
    images: images(_xyz),

    documents: documents(_xyz),
  
    group: group(_xyz),
  
    geometry: geometry(_xyz),
  
    meta: meta(_xyz),
  
    edit: edit(_xyz),
  
    boolean: boolean(_xyz),
  
    tableDefinition: tableDefinition(_xyz),
  
    orderedList: orderedList(_xyz),

    dashboard: dashboard(_xyz),
  
    report: report(_xyz),
  
    valChange: valChange

  };

  location.view = view;

  location.view.update();

  // Create drawer element to contain the header with controls and the infoj table with inputs.
  location.view.drawer = _xyz.utils.wire()`<div class="drawer expandable expanded">`;

  // Create colorfilter for icons.
  const colorFilter = _xyz.utils.colorFilter(location.style.strokeColor || '#000');

  // Create the header element to contain the control elements
  location.view.header = _xyz.utils.wire()`
  <div
  style = "${'border-bottom: 2px solid ' + location.style.strokeColor}"
  class = "header">
  <div>
  ${String.fromCharCode(64 + _xyz.locations.list.length - _xyz.locations.list.indexOf(location.record))}`;
  

  location.view.header.onclick = () => {
    _xyz.utils.toggleExpanderParent({
      expandable: location.view.drawer,
      accordeon: true,
    });
  };

  location.view.drawer.appendChild(location.view.header);


  // Expander icon.
  location.infoj && location.view.header.appendChild(_xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Toggle location view drawer."
    class = "btn_header xyz-icon icon-expander "
    onclick = ${e => {
      e.stopPropagation();
      
      _xyz.utils.toggleExpanderParent({
        expandable: location.view.drawer,
      });
    }}>`);


  // Zoom to location bounds.
  location.view.header.appendChild(_xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Zoom map to feature bounds"
    class = "btn_header xyz-icon icon-search"
    onclick = ${e => {
      e.stopPropagation();
      location.flyTo();
    }}>`);

  // Update icon.
  location.view.upload = _xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Save changes to cloud."
    class = "btn_header xyz-icon icon-cloud-upload"
    disabled
    onclick = ${e => {
      e.stopPropagation();
      
      location.update();
    }}>`;

  location.view.header.appendChild(location.view.upload);

  location.view.editor = _xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Edit the locations geometry."
    class = "btn_header xyz-icon icon-build"
    onclick = ${e => {
      e.stopPropagation();

      if (location.view.header.classList.contains('edited')) return _xyz.mapview.interaction.edit.finish();

      location.view.header.classList.add('edited');

      _xyz.mapview.interaction.edit.begin({
        location: location,
        type: 'LineString',
        callback: () => {
          location.view.header.classList.remove('edited');
        }
      });
    }}>`;

  location.layer.edit && location.view.header.appendChild(location.view.editor);
 

  // Trash icon.
  location.view.trash = _xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Delete location."
    class = "btn_header xyz-icon icon-trash"
    onclick = ${e => {
      e.stopPropagation();
      location.trash();
    }}>`;

  location.editable && location.view.header.appendChild(location.view.trash);

  // Toggle marker.
  location.view.header.appendChild(_xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Hide marker"
    class = "btn_header xyz-icon icon-location-tick" 
    onclick = ${e => {
      e.stopPropagation();
      if(e.target.classList.contains('icon-location')){
        e.target.classList.remove('icon-location')
        e.target.classList.add('icon-location-tick')
        _xyz.map.addLayer(location.Marker);
      } else {
        e.target.classList.remove('icon-location-tick');
        e.target.classList.add('icon-location');
        _xyz.map.removeLayer(location.Marker);
      }
    }}>`);
  

  // Clear selection.
  location.view.header.appendChild(_xyz.utils.wire()`
  <button
    style = "${'filter: ' + colorFilter}"
    title = "Remove feature from selection"
    class = "btn_header xyz-icon icon-close"
    onclick = ${e => {
      e.stopPropagation();
      location.remove();
    }}>`);
  

  // Add location view to drawer.
  location.view.drawer.appendChild(location.view.node);

};