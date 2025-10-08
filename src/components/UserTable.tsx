import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Check, X, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  nombre: string;
  correo: string;
  fecha_registro: string;
}

interface UserTableProps {
  users: User[];
  onUserUpdated: () => void;
}

export const UserTable = ({ users, onUserUpdated }: UserTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editCorreo, setEditCorreo] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditNombre(user.nombre);
    setEditCorreo(user.correo);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditCorreo("");
  };

  const handleUpdate = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: editNombre, correo: editCorreo }),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      toast({
        title: "¡Actualizado!",
        description: "Usuario actualizado correctamente",
      });

      cancelEdit();
      onUserUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      toast({
        title: "¡Eliminado!",
        description: "Usuario eliminado correctamente",
      });

      setDeleteId(null);
      onUserUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Card className="shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        {editingId === user.id ? (
                          <Input
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            disabled={isLoading}
                            className="h-8"
                          />
                        ) : (
                          user.nombre
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === user.id ? (
                          <Input
                            type="email"
                            value={editCorreo}
                            onChange={(e) => setEditCorreo(e.target.value)}
                            disabled={isLoading}
                            className="h-8"
                          />
                        ) : (
                          user.correo
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.fecha_registro)}</TableCell>
                      <TableCell className="text-right">
                        {editingId === user.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUpdate(user.id)}
                              disabled={isLoading}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={cancelEdit}
                              disabled={isLoading}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEdit(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteId(user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
