"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  title: string;
  onRefresh: () => void;
  createForm?: React.ReactNode;
  editForm?: (item: T) => React.ReactNode;
  deleteEndpoint: (id: number) => string;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  title,
  onRefresh,
  createForm,
  editForm,
  deleteEndpoint,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    try {
      await api.delete(deleteEndpoint(id));
      toast.success("Usunięto pomyślnie");
      onRefresh();
    } catch (error) {
      toast.error("Błąd podczas usuwania");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {createForm && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Dodaj nowy</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj {title.toLowerCase()}</DialogTitle>
              </DialogHeader>
              {createForm}
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Input
        placeholder="Szukaj..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead>Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(item => (
            <TableRow key={item.id}>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {col.render ? col.render(item[col.key as keyof T], item) : String(item[col.key as keyof T])}
                </TableCell>
              ))}
              <TableCell>
                {editForm && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2">Edytuj</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edytuj {title.toLowerCase()}</DialogTitle>
                      </DialogHeader>
                      {editForm(item)}
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  Usuń
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}