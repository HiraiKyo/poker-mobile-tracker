const toNumberWithMinus = (string: string) => {
  if(string === "-"){
    return "-";
  }
  const number = Number(string);
  if(Number.isNaN(number)){
    return "";
  }
  return number;
} 