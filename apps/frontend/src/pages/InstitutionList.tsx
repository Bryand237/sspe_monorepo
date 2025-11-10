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
  Building2,
  School,
  Loader2,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useInstitutions } from "@/hooks/useInstitutions";
import { useActionsStore } from "@/stores/useActionsStore";
import { Institution } from "@/interfaces/institution";
import ModalForm from "@/components/ModalForm";
import { SubmitHandler, useForm } from "react-hook-form";
import InstitutionForm from "@/components/forms/InstitutionForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function InstitutionList() {
  const {
    Institutions,
    addInstitution,
    updateInstitution,
    deleteInstitution,
    isLoading,
  } = useInstitutions();
  const data = React.useMemo(() => Institutions || [], [Institutions]);
  const addAction = useActionsStore((state) => state.addAction);
  const navigate = useNavigate();

  const columns: ColumnDef<Institution>[] = [
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const Icon = type === "école" ? School : Building2;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="capitalize">{type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom complet
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("fullname")}</div>
      ),
    },
    {
      accessorKey: "abbreviation",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Abbréviation
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("abbreviation")}</div>
      ),
    },
    {
      accessorKey: "host",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            L'hote
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("host")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const institution = row.original;

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
                onClick={() => {
                  setInstitution(institution);
                  setOpenUpd(true);
                }}
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  try {
                    await deleteInstitution.mutateAsync(
                      institution.id as string
                    );
                    toast.success("Institution supprimée");
                    addAction({
                      name: "Institution supprimée",
                      icon: Building2,
                    });
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
  const [institution, setInstitution] = React.useState<Institution>(
    {} as Institution
  );
  const [openUpd, setOpenUpd] = React.useState(false);

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

  const createMethods = useForm<Institution>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const handleCreate: SubmitHandler<Institution> = async (
    values: Institution
  ) => {
    try {
      await addInstitution.mutateAsync(values);
      toast.success("Institution ajoutée avec succès");
      addAction({ name: "Institution ajoutée", icon: Building2 });
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const updateMethods = useForm<Institution>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const handleUpdate: SubmitHandler<Institution> = async (
    values: Institution
  ) => {
    try {
      const dataToSend = { ...values, id: institution.id };
      await updateInstitution.mutateAsync(dataToSend);
      toast.success("Institution modifiée avec succès");
      addAction({ name: "Institution modifiée", icon: Building2 });
      setOpenUpd(false);
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  // reset update form when institution changes
  React.useEffect(() => {
    if (institution && institution.id) {
      updateMethods.reset(institution);
    }
  }, [institution]);

  const FormComponent: React.FC = () => {
    return (
      <>
        <ModalForm
          trigger={
            <button className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600">
              Ajouter une institution
            </button>
          }
          title="Nouvel institution"
          description=""
          methods={createMethods}
          onSubmit={handleCreate}
          submitLabel="Ajouter"
        >
          {/* champs du formulaire : utilisez vos inputs connectés à react-hook-form */}
          <InstitutionForm methods={createMethods} />
        </ModalForm>

        <ModalForm
          trigger={
            <button style={{ display: 'none' }}>
              Modifier une Institution
            </button>
          }
          title="Modification de l'institution"
          description=""
          methods={updateMethods}
          onSubmit={handleUpdate}
          submitLabel="Modifier"
          open={openUpd}
          onOpenChange={setOpenUpd}
        >
          <InstitutionForm methods={updateMethods} />
        </ModalForm>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Chargement des institutions...
          </p>
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
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Liste des Institutions</h1>
            <p className="text-sm text-muted-foreground">
              {Institutions?.length || 0} institution(s) enregistrée(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            onClick={() => navigate("/enseignants/localisation")}
            className="gap-2"
          >
            <MapPin className="w-4 h-4" />
            Voir la carte
          </Button> */}
          <FormComponent />
        </div>
      </div>

      {/* Filtres et table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center py-4">
          <Input
            placeholder="Rechercher par abréviation..."
            value={
              (table.getColumn("abbreviation")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("abbreviation")
                ?.setFilterValue(event.target.value)
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

export default InstitutionList;
