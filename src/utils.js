import { eyesColors } from "./config/eyes-color";
import { feethTeeth } from "./config/feet-teeth";
import { genders } from "./config/genders";
import { hairColors } from "./config/hair-colors";
import { hands } from "./config/hands";
import { instruments } from "./config/instruments";
import { languages } from "./config/languages";
import { otherSkills } from "./config/other-skills";
import { skinColor } from "./config/skin-color";
import { sports } from "./config/sports";

/**
 * Formatea una fecha en formato YYYY-MM-DD a DD/MM/YYYY
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha en formato DD/MM/YYYY
 */
export function formatDate(dateString) {
    if (!dateString) {
        return '';
    }
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    const dayFormatted = String(date.getDate()).padStart(2, '0');
    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0'); // Meses son base 0
    const yearFormatted = date.getFullYear();
    
    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
}

/**
 * Formatea una url agregando https:// si no está presente ni http:// ni https://
 * @param {string} url 
 * @returns {string} url que comienza con https://
 */
export function formatUrl(url) {
    if (!url) {
        return ''; 
    }
    //Para que redireccione bien se agrega el https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    return url;
}

/**
 * Recibe una lista a ordenar, un atributo por el cual ordenar y 
 * un booleano que indica si se ordenara de forma descendente o ascendente.
 * Ordena la lista.
 * @param {Array} listToOrder 
 * @param {string} attribute 
 * @param {Boolean} orderDesc 
 */
export function sortBy(listToOrder, attribute, orderDesc) {
    if (orderDesc) {
        listToOrder.sort((a,b) => a[attribute] < b[attribute] ? -1 : 1);
    } else {
        listToOrder.sort((a,b) => a[attribute] > b[attribute] ? -1 : 1);
    }
}

/**
 * Recibe el nombre de un campo de formulario de seleccion y devuelve las opciones
 * que puede tener ese campo
 * @param {string} fieldName 
 * @returns {Array} Opciones para un campo de formulario
 */
export function getOptionsFromField(fieldName) {
    switch (fieldName) {
        case 'Género':
            return ['No Selecciona'].concat(genders);
        case 'Color de Ojos':
            return ['No Selecciona'].concat(eyesColors);
        case 'Color de Piel':
            return ['No Selecciona'].concat(skinColor);
        case 'Color de Pelo':
            return ['No Selecciona'].concat(hairColors);
        case 'Manos':
            return ['No Selecciona'].concat(hands);
        case 'Pies':
            return ['No Selecciona'].concat(feethTeeth);
        case 'Dientes':
            return ['No Selecciona'].concat(feethTeeth);
        case 'Tatuajes' || 'Piercings' || 'Brackets' 
            || 'Canto' || 'Danza'|| 'Lic. Conducir (Auto)' || 'Lic. Conducir (Moto)' : 
            return ['No Selecciona', 'Sí', 'No'];
        case 'Idiomas':
            return languages;
        case 'Deportes':
            return sports;
        case 'Instrumentos':
            return instruments;
        case 'Habilidades Extras':
            return otherSkills;
        default:
          return null;
    }
}