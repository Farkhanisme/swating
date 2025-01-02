export const formatRupiah = (angka) => {
  let number_string = angka.toString().replace(/[^,\d]/g, ""),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return "Rp. " + rupiah;
};

export const hurufKapital = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const convertRupiahToNumber = (rupiahString) => {
  // Hilangkan simbol "Rp." dan titik
  const cleanedString = rupiahString.replace(/[^0-9]/g, "");
  // Ubah ke integer
  const number = parseInt(cleanedString, 10);
  return number;
};