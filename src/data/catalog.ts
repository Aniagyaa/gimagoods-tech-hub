import type { Category, Product } from "@/types/commerce";
import hpLaptop from "@/assets/products/hp-laptop.jpg";
import dellLatitude from "@/assets/products/dell-latitude.jpg";
import samsungMonitor from "@/assets/products/samsung-monitor.jpg";
import logitechMouse from "@/assets/products/logitech-mouse.jpg";
import mechanicalKeyboard from "@/assets/products/mechanical-keyboard.jpg";
import tpLinkRouter from "@/assets/products/tp-link-router.jpg";
import portableSsd from "@/assets/products/portable-ssd.jpg";
import bluetoothHeadset from "@/assets/products/bluetooth-headset.jpg";

export const categories: Category[] = [
  { id: "laptops", name: "Laptops", description: "Study, work and create", itemCount: 24, icon: "Laptop" },
  { id: "desktops", name: "Desktop Computers", description: "Reliable everyday systems", itemCount: 12, icon: "Monitor" },
  { id: "monitors", name: "Monitors", description: "Sharper, larger displays", itemCount: 18, icon: "PanelTop" },
  { id: "smartphones", name: "Smartphones", description: "Stay connected anywhere", itemCount: 20, icon: "Smartphone" },
  { id: "tablets", name: "Tablets", description: "Portable work and play", itemCount: 10, icon: "Tablet" },
  { id: "networking", name: "Networking", description: "Routers, switches and Wi-Fi", itemCount: 31, icon: "Router" },
  { id: "storage", name: "Storage", description: "SSDs, drives and flash", itemCount: 28, icon: "HardDrive" },
  { id: "accessories", name: "Computer Accessories", description: "Everyday tech essentials", itemCount: 46, icon: "Usb" },
  { id: "input", name: "Keyboards & Mice", description: "Comfort and control", itemCount: 35, icon: "Keyboard" },
  { id: "audio", name: "Headsets & Audio", description: "Calls, music and gaming", itemCount: 22, icon: "Headphones" },
  { id: "power", name: "Chargers & Power", description: "Power at home or away", itemCount: 29, icon: "BatteryCharging" },
  { id: "printers", name: "Printers", description: "Home and office printing", itemCount: 9, icon: "Printer" },
  { id: "security", name: "CCTV & Security", description: "Protect your space", itemCount: 17, icon: "Cctv" },
  { id: "cables", name: "Cables", description: "Connect every device", itemCount: 52, icon: "Cable" },
  { id: "components", name: "Components", description: "Build and upgrade", itemCount: 39, icon: "Cpu" },
  { id: "gaming", name: "Gaming", description: "Gear built to perform", itemCount: 21, icon: "Gamepad2" },
];

export const products: Product[] = [
  { id: "hp-probook-440", name: "HP ProBook 440 G10", brand: "HP", category: "Laptops", description: "Core i5, 16GB RAM, 512GB SSD", price: 10499, previousPrice: 11299, rating: 4.8, reviewCount: 34, status: "demo", image: hpLaptop, imageAlt: "Silver HP-style business laptop on a studio background", featured: true, keywords: ["computer", "student", "business"], specs: { Processor: "Intel Core i5", Memory: "16GB RAM", Storage: "512GB SSD", Display: "14-inch Full HD", Graphics: "Integrated Intel graphics", System: "Windows-ready", Ports: "USB-C, USB-A, HDMI" } },
  { id: "dell-latitude-5440", name: "Dell Latitude 5440", brand: "Dell", category: "Laptops", description: "Core i7, 16GB RAM, 512GB SSD", price: 12950, rating: 4.7, reviewCount: 27, status: "demo", image: dellLatitude, imageAlt: "Dark business laptop on a studio background", featured: true, newArrival: true, keywords: ["computer", "office", "business"], specs: { Processor: "Intel Core i7", Memory: "16GB RAM", Storage: "512GB SSD", Display: "14-inch Full HD", Graphics: "Integrated Intel graphics", System: "Windows-ready", Ports: "USB-C, USB-A, HDMI" } },
  { id: "samsung-viewfinity", name: "Samsung ViewFinity S6 27\"", brand: "Samsung", category: "Monitors", description: "QHD IPS display, USB-C connectivity", price: 4299, previousPrice: 4699, rating: 4.6, reviewCount: 18, status: "demo", image: samsungMonitor, imageAlt: "27-inch monitor on a light studio background", featured: true, trending: true },
  { id: "logitech-m650", name: "Logitech Signature M650", brand: "Logitech", category: "Keyboards & Mice", description: "Silent wireless mouse", price: 689, rating: 4.9, reviewCount: 91, status: "demo", image: logitechMouse, imageAlt: "Black ergonomic wireless mouse", featured: true, trending: true },
  { id: "keychron-k2", name: "Keychron K2 Mechanical", brand: "Keychron", category: "Keyboards & Mice", description: "Wireless, hot-swappable switches", price: 1499, previousPrice: 1649, rating: 4.8, reviewCount: 48, status: "demo", image: mechanicalKeyboard, imageAlt: "Compact mechanical keyboard with lime accent keys", trending: true },
  { id: "tplink-ax55", name: "TP-Link Archer AX55", brand: "TP-Link", category: "Networking", description: "AX3000 dual-band Wi-Fi 6 router", price: 1599, rating: 4.7, reviewCount: 63, status: "demo", image: tpLinkRouter, imageAlt: "Black Wi-Fi router with four antennas", trending: true },
  { id: "samsung-t7", name: "Samsung T7 512GB SSD", brand: "Samsung", category: "Storage", description: "Portable USB 3.2 solid-state drive", price: 1199, previousPrice: 1349, rating: 4.9, reviewCount: 76, status: "demo", image: portableSsd, imageAlt: "Black portable solid-state drive", trending: true },
  { id: "jbl-tune-770", name: "JBL Tune 770NC", brand: "JBL", category: "Headsets & Audio", description: "Wireless noise-cancelling headset", price: 1299, rating: 4.6, reviewCount: 42, status: "demo", image: bluetoothHeadset, imageAlt: "Black over-ear wireless headphones", trending: true },
];

export const formatCedis = (amount: number) => `GH₵ ${amount.toLocaleString("en-GH")}`;
