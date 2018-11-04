import { createElement } from './createElement.mjs';

// Dropdown factory.
export function dropdown(param) {

    if (param.title) createElement({
        tag: 'div',
        options: {
            textContent: param.title
        },
        appendTo: param.appendTo
    });

    let select = createElement({
        tag: 'select',
        appendTo: param.appendTo
    });

    if (param.entries.length) {

        // Create select options from entries Array.
        param.entries.forEach(entry => {
            createElement({
                tag: 'option',
                options: {
                    // Assign first value as text if entry is object.
                    textContent: typeof (entry) == 'object' ? Object.values(entry)[0] : entry,
                    // Assign first key as value if entry is object.
                    value: typeof (entry) == 'object' ? Object.keys(entry)[0] : entry
                },
                appendTo: select
            });
        });

    } else {

        // Create select options from Object if length is undefined.
        Object.keys(param.entries).forEach(entry => {
            createElement({
                tag: 'option',
                options: {
                    textContent: param.entries[entry][param.label] || entry,
                    value: param.entries[entry][param.val] || entry
                },
                appendTo: select
            });
        });
    }

    select.disabled = (select.childElementCount === 1);

    select.onchange = param.onchange;

    // Get the index of the selected option from the select element.
    select.selectedIndex = () => {

        if (!param.selected) return 0;

        for (let i = 0; i < select.length; i++) {
            if (select[i].value == param.selected) return i;
        }
    
        return -1;
    };

}