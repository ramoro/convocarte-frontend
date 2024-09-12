/**
 * Formatea una fecha en formato YYYY-MM-DD a DD/MM/YYYY
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha en formato DD/MM/YYYY
 */
export function formatDate(dateString) {
    console.log("ENTRO");
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);

    const dayFormatted = String(date.getDate()).padStart(2, '0');
    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0'); // Meses son base 0
    const yearFormatted = date.getFullYear();
    
    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
}