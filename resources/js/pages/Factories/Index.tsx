import React, { useState, useEffect, useRef, Fragment } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableHeader, TableHead, TableBody,
  TableRow, TableCell, TableCaption,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';

type Factory = {
  id: number;
  name: string;
  category: { id: number; name: string } | null;
  contact: string | null;
};

export default function Index() {
  const { factories, toastData, filters } = usePage<{
    factories: { data: Factory[]; meta?: any; current_page?: number; last_page?: number };
    toastData?: any;
    filters: { search?: string };
  }>().props;

  const [search, setSearch] = useState(filters.search || '');
  const debounce = useRef<number>();

  useEffect(() => {
    if (toastData) toast(toastData.title, { description: toastData.message, type: toastData.type });
  }, [toastData]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(route('factories.index'), { search }, { preserveState: true, replace: true });
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const data = factories.data;
  const lastPage = factories.meta?.last_page ?? factories.last_page ?? 1;
  const currentPage = factories.meta?.current_page ?? factories.current_page ?? 1;

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number|null>(null);

  const onDeleteClick = (id:number) => { setDeletingId(id); setConfirmOpen(true); };
  const handleDelete = () => {
    router.delete(route('factories.destroy', deletingId!));
    setConfirmOpen(false);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title:'Dashboard', href:route('dashboard') },
        { title:'Factories', href:route('factories.index') },
      ]}
    >
      <Head title="Factories" />
      <div className="p-8">
        <div className="flex justify-between mb-4">
          <Input placeholder="Search…" value={search}
            onChange={e=>setSearch(e.currentTarget.value)} className="max-w-sm"/>
          <Button asChild><Link href={route('factories.create')}>New Factory</Link></Button>
        </div>

        {data.length>0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(f=>(
              <TableRow key={f.id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.category?.name||'—'}</TableCell>
                <TableCell>{f.contact||'—'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={route('factories.edit', f.id)}><Edit size={16} /></Link>
                  <button type="button" onClick={()=>onDeleteClick(f.id)}>
                    <Trash2 size={16} className="text-red-600"/>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
          <TableCaption>No factories found.</TableCaption>
        )}

        {lastPage>1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({length:lastPage},(_,i)=>i+1).map(p=>(
              <Button key={p}
                variant={currentPage===p?'default':'outline'}
                size="sm"
                onClick={()=>router.get(route('factories.index'),{page:p,search},{preserveState:true,replace:true})}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>setConfirmOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded shadow-lg">
              <Dialog.Title className="text-lg font-medium">Confirm Deletion</Dialog.Title>
              <p className="mt-2">This cannot be undone.</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
