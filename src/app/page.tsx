"use client"; // Add this directive at the top to make it a client component

import { useState } from "react";
import Image from "next/image";
import Dropdown from "./components/Dropdown";

export default function Home() {
  const grades = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
  ];

  const rooms = [
    { id: 1, name: "1 - SMEP" },
    { id: 2, name: "2 - Arts" },
    { id: 3, name: "3 - Science" },
  ];

  const [selectedGrade, setSelectedGrade] = useState(grades[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="PTK Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-white">PTK Schedule Viewer</h1>
        <p className="mt-2 text-white font-light opacity-60">
          ระบบเช็คตารางเรียน โรงเรียนปทุมเทพวิทยาคาร
        </p>
        <div className="mt-6 space-y-4">
          {/* Grade Dropdown */}
          <Dropdown
            label="มัธยม"
            options={grades}
            selected={selectedGrade}
            onChange={setSelectedGrade}
          />

          {/* Room Dropdown */}
          <Dropdown
            label="ห้อง"
            options={rooms}
            selected={selectedRoom}
            onChange={setSelectedRoom}
          />

          {/* Submit Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-white py-2 text-[#191919] hover:bg-gray-300 transition-colors"
          >
            ค้นหา
          </button>
        </div>
      </div>
    </div>
  );
}
