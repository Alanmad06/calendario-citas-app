
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-primary-300">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">Bienvenido a tu Servicio de Citas</h1>
        
        <p className="text-lg text-white/90 mt-4">
          Agenda tus citas de manera fácil y rápida con nuestro sistema de reservas online.
        </p>
        
        <div className="mt-8">
          <Link href="/login">
            <Button className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto rounded-full font-semibold">
              Agenda tu cita aquí
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Fácil de usar</h3>
            <p className="text-white/80">Interfaz intuitiva para agendar tus citas en pocos pasos</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Disponibilidad</h3>
            <p className="text-white/80">Consulta horarios disponibles en tiempo real</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Recordatorios</h3>
            <p className="text-white/80">Recibe notificaciones de tus próximas citas</p>
          </div>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-white/70">
        <p>© {new Date().getFullYear()} Servicio de Citas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
