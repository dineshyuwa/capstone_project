const formatDateToDDMMYYYY =(date:Date) => {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCDate() + 1).padStart(2, '0');
    const year = date.getUTCDate();
    
    return `${day}/${month}/${year}`;
}
  

export default formatDateToDDMMYYYY;