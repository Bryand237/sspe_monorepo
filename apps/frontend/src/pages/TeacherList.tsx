import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Users,
  UserPlus,
  Loader2,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Teacher } from "@/interfaces/teacher";
import { useTeachers } from "@/hooks/useTeachers";
import { useActionsStore } from "@/stores/useActionsStore";
import TeacherForm from "@/components/forms/TeacherForm";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import ModalForm from "@/components/ModalForm";
import { toast } from "sonner";

let data: Teacher[];

function TeacherList() {
  const { Teachers, addTeacher, updateTeacher, deleteTeacher, isLoading } =
    useTeachers();
  const [teacher, setTeacher] = React.useState<Teacher>({} as Teacher);
  const [openUpd, setOpenUpd] = React.useState<boolean>(false);
  const addAction = useActionsStore((state) => state.addAction);
  const navigate = useNavigate();

  const columns: ColumnDef<Teacher>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.getValue("statut") as string;
        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statut === "actif"
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
            }`}
          >
            {statut}
          </div>
        );
      },
    },
    {
      accessorKey: "matricule",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Matricule
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("matricule")}</div>
      ),
    },
    {
      accessorKey: "firstname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Noms
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("firstname")}</div>
      ),
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prénoms
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("lastname")}</div>
      ),
    },
    {
      accessorKey: "grade",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Grade
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("grade")}</div>
      ),
    },
    {
      accessorKey: "cei",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CEI
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("cei")}</div>,
    },
    {
      accessorKey: "functions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fonction
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("functions")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const teacher = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate(`/enseignants/liste/${teacher.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setTeacher(teacher);
                  setOpenUpd(true);
                }}
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  try {
                    await deleteTeacher.mutateAsync(teacher.id || "");
                    toast.success("Enseignant supprimé");
                    addAction({ name: "Enseignant supprimé", icon: UserPlus });
                  } catch {
                    toast.error("Erreur lors de la suppression");
                  }
                }}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  data = React.useMemo(() => Teachers || [], [Teachers]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const createMethods = useForm<Teacher>();
  const handleCreate: SubmitHandler<Teacher> = async (values: Teacher) => {
    try {
      await addTeacher.mutateAsync(values);
      toast.success("Enseignant ajouté avec succès");
      addAction({ name: "Enseignant ajouté", icon: UserPlus });
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const updateMethods = useForm<Teacher>();
  const handleUpdate: SubmitHandler<Teacher> = async (values: Teacher) => {
    try {
      const dataToSend = { ...values, id: teacher.id };
      await updateTeacher.mutateAsync(dataToSend);
      toast.success("Enseignant modifié avec succès");
      addAction({ name: "Enseignant modifié", icon: UserPlus });
      setOpenUpd(false);
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  // Reset update form when teacher changes
  React.useEffect(() => {
    if (teacher && teacher.id) {
      updateMethods.reset(teacher);
    }
  }, [teacher]);

  const FormComponent: React.FC = () => {
    return (
      <>
        <ModalForm
          trigger={
            <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter un Enseignant
            </button>
          }
          title="Nouvel enseignant"
          description=""
          methods={createMethods}
          onSubmit={handleCreate}
          submitLabel="Ajouter"
        >
          {/* champs du formulaire : utilisez vos inputs connectés à react-hook-form */}
          <TeacherForm {...createMethods} />
        </ModalForm>

        <ModalForm
          trigger={
            <button style={{ display: "none" }}>Modifier un Enseignant</button>
          }
          title="Modification enseignant"
          description=""
          methods={updateMethods}
          onSubmit={handleUpdate}
          submitLabel="Modifier"
          open={openUpd}
          onOpenChange={setOpenUpd}
        >
          <TeacherForm {...updateMethods} />
        </ModalForm>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des enseignants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between pb-4 border-b mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Liste des Enseignants</h1>
            <p className="text-sm text-muted-foreground">
              {Teachers?.length || 0} enseignant(s) enregistré(s)
            </p>
          </div>
        </div>
        <FormComponent />
      </div>

      {/* Filtres et table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter matricule..."
            value={
              (table.getColumn("matricule")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("matricule")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherList;
