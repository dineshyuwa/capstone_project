const isValidDate = (day:string, month:string, year:string) => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
  
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      return false;
    }
  
    if (dayNum < 1 || dayNum > 31) {
      return false;
    }

    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    if (yearNum < 1900 || yearNum > 2100) {
      return false;
    }

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      return false;
    }
  
    return true;
}
  
export default isValidDate;
