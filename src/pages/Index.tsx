import { useEffect, useState } from "react";
import { UserForm } from "@/components/UserForm";
import { UserTable } from "@/components/UserTable";
import { Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  nombre: string;
  correo: string;
  fecha_registro: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/usuarios");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el backend. Asegúrate de que esté corriendo en http://localhost:5000",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Sistema de Gestión de Usuarios</h1>
          </div>
          <p className="text-primary-foreground/90 text-lg">
            API CRUD con MySQL y Flask
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
          {/* Formulario */}
          <div>
            <UserForm onUserAdded={fetchUsers} />
          </div>

          {/* Tabla */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <UserTable users={users} onUserUpdated={fetchUsers} />
            )}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-12 p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">📋 Configuración del Backend</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Este frontend se conecta a: <code className="bg-muted px-2 py-1 rounded">http://localhost:5000</code></p>
            <p>Endpoints esperados:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>GET /api/usuarios</code> - Obtener todos los usuarios</li>
              <li><code>POST /api/usuarios</code> - Crear usuario (body: nombre, correo)</li>
              <li><code>PUT /api/usuarios/:id</code> - Actualizar usuario</li>
              <li><code>DELETE /api/usuarios/:id</code> - Eliminar usuario</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
