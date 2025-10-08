import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserFormProps {
  onUserAdded: () => void;
}

export const UserForm = ({ onUserAdded }: UserFormProps) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !correo) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo }),
      });

      if (!response.ok) throw new Error("Error al crear usuario");

      toast({
        title: "¡Éxito!",
        description: "Usuario creado correctamente",
      });

      setNombre("");
      setCorreo("");
      onUserAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario. Verifica que el backend esté corriendo.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Agregar Nuevo Usuario
        </CardTitle>
        <CardDescription>Completa los datos para crear un nuevo usuario</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              placeholder="juan@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creando..." : "Crear Usuario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
