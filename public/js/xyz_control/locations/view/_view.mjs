import update from './update.mjs';

import group from './group.mjs';

import streetview from './streetview.mjs';

import images from './images.mjs';

import documents from './documents.mjs';

import meta from './meta.mjs';

import tableDefinition from './tableDefinition.mjs';

import orderedList from './orderedList.mjs';

import dashboard from './dashboard.mjs';

import report from './report.mjs';

import boolean from './boolean.mjs';

import geometry from './geometry/_geometry.mjs';

import edit from './edit/_edit.mjs';

export default _xyz => {

  const view = {

    create: create,

    update: update(_xyz),

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

  };

  return view;


  function create(location){

    location.view = {};


    // Create drawer element to contain the header with controls and the infoj table with inputs.
    location.view.drawer = _xyz.utils.wire()`
    <div class="drawer expandable expanded">`;


    // Create the header element to contain the control elements
    const header = _xyz.utils.wire()`
    <div
      class = "header"
      style = "${'border-bottom: 2px solid ' + location.style.strokeColor}"
      onclick = ${e => {
        e.preventDefault();
        _xyz.utils.toggleExpanderParent({
          expandable: e.target.parentElement,
          accordeon: true,
        });
      }}>
      <div>${String.fromCharCode(64 + _xyz.locations.list.length - _xyz.locations.list.indexOf(location.record))}`;

    location.view.drawer.appendChild(header);


    // Expander icon.
    location.infoj && header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Toggle location view drawer."
      class = "btn_header xyz-icon icon-expander "
      onclick = ${e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: location.view.drawer,
        });
      }}>`);


    // Zoom to location bounds.
    header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Zoom map to feature bounds"
      class = "btn_header xyz-icon icon-search"
      onclick = ${e => {
        e.stopPropagation();
        location.flyTo();
      }}>`);


    // Update icon.
    location.view.upload = _xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Save changes to cloud."
      class = "btn_header xyz-icon icon-cloud-upload"
      disabled
      onclick = ${e => {
        e.stopPropagation();
        location.update();
      }}>`;

    header.appendChild(location.view.upload);


    location.view.valChange = (param) => {

      if (typeof param.newValue === 'undefined') param.newValue = param.input.value;

      if (param.entry.value != param.newValue) {

        param.entry.newValue = param.newValue;
        param.input.classList.add('primary-colour');
      } else {

        delete param.entry.newValue;
        param.input.classList.remove('primary-colour');
      }

      // Hide upload button if no other field in the infoj has a newValue.
      if (!param.entry.location.infoj.some(field => typeof field.newValue !== 'undefined')) {

        param.entry.location.view.upload.disabled = true;
      } else {

        param.entry.location.view.upload.disabled = false;
      }

    };


    // Edit geometry icon
    location.layer.edit && header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Edit the locations geometry."
      class = "btn_header xyz-icon icon-build"
      onclick = ${e => {
        e.stopPropagation();

        if (header.classList.contains('edited')) return _xyz.mapview.interaction.edit.finish();

        header.classList.add('edited', 'secondary-colour-bg');

        _xyz.mapview.interaction.edit.begin({
          location: location,
          type: 'LineString',
          callback: () => {
            header.classList.remove('edited', 'secondary-colour-bg');
          }
        });
      }}>`);


    // Trash icon.
    location.editable && header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Delete location."
      class = "btn_header xyz-icon icon-trash"
      onclick = ${e => {
        e.stopPropagation();
        location.trash();
      }}>`);


    // Toggle marker.
    header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
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
    header.appendChild(_xyz.utils.wire()`
    <button
      style = "${'filter: ' + location.colorFilter}"
      title = "Remove feature from selection"
      class = "btn_header xyz-icon icon-close"
      onclick = ${e => {
        e.stopPropagation();
        location.remove();
      }}>`);


    location.infoj && location.view.drawer.appendChild(view.update(location));

  };

}