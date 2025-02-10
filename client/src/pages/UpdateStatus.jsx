import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateStatus = () => {
  const [penitip, setPenitip] = useState([]);

  const [formData, setFormData] = useState({
    barangId: "",
    penitipId: "",
    tanggal: "",
    bulan: "",
    tanggalMulai: "",
    tanggalAkhir: "",
    status: "Lunas",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateStatus = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/update-status`,
        formData
      );
      alert("Status berhasil diperbarui!");
      // console.log(formData);
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      alert("Gagal memperbarui status.");
    }
  };

  useEffect(() => {
    const getPenitip = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/get-penitip`
        );
        setPenitip(response.data);
      } catch (error) {
        toast.error("Gagal mengambil data");
      }
    };
    getPenitip();
  });

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">Update Status Setor</h2>
      <div className="flex w-full space-x-2">
        <div className="flex flex-col w-1/2">
          <label>Barang ID (Opsional):</label>
          <input
            type="text"
            name="barangId"
            value={formData.barangId}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
            placeholder="Opsional"
          />
        </div>

        <div className="flex flex-col w-1/2">
          <label>Penitip ID (Opsional):</label>
          <select
            name="penitipId"
            value={formData.penitipId}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          >
            <option>Pilih Penitip</option>
            {penitip.map((pen) => (
              <option key={pen.id} value={pen.id}>
                {pen.nama} | {pen.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex w-full space-x-2">
        <div className="flex flex-col w-1/2">
          <label>Tanggal (YYYY-MM-DD):</label>
          <input
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          />
        </div>

        <div className="flex flex-col w-1/2">
          <label>Bulan (YYYY-MM):</label>
          <input
            type="month"
            name="bulan"
            value={formData.bulan}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          />
        </div>
      </div>

      <label>Rentang Tanggal:</label>
      <div className="flex space-x-2 mb-3">
        <div className="flex flex-col w-1/2">
          <label htmlFor="">Tanggal Mulai</label>
          <input
            type="date"
            name="tanggalMulai"
            value={formData.tanggalMulai}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label htmlFor="">Tanggal Akhir</label>
          <input
            type="date"
            name="tanggalAkhir"
            value={formData.tanggalAkhir}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      <label>Status:</label>
      <div className="flex w-full space-x-2">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 mb-3 w-1/2 rounded"
        >
          <option value="Belum Lunas">Belum Lunas</option>
          <option value="Lunas">Lunas</option>
        </select>
        <button
          onClick={updateStatus}
          className="w-1/2 bg-blue-500 text-white p-2 rounded h-fit"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default UpdateStatus;
