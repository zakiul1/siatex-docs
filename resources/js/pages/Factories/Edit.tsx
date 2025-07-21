import React, { useState, useEffect, Fragment } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Dialog, Transition } from '@headlessui/react';

type Category = { id: number; name: string };
type Certificate = { id: number; name: string; file_path: string };
type Image = { id: number; file_path: string; alt_text: string };

export default function Edit() {
  const { factory, categories } = usePage<{
    factory: {
      id: number;
      name: string;
      address: string;
      contact: string | null;
      category_id: number | null;
      compliance: string | null;
      production_capacity: number | null;
      profile: { file_path: string } | null;
      certificates: Certificate[];
      images: Image[];
    };
    categories: Category[];
  }>().props;

  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    name: factory.name,
    address: factory.address,
    contact: factory.contact || '',
    category_id: factory.category_id || '',
    compliance: factory.compliance || '',
    production_capacity: factory.production_capacity?.toString() || '',
    profile: null as File | null,
    certificates: [] as File[],
    images: [] as File[],
  });

  // Previews and existing
  const [profileName, setProfileName] = useState<string | null>(
    factory.profile?.file_path.split('/').pop() || null
  );
  const [newCertNames, setNewCertNames] = useState<string[]>([]);
  const [existingCerts, setExistingCerts] = useState<Certificate[]>(factory.certificates);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Image[]>(factory.images);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Category modal
  const [newCat, setNewCat] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  // Handlers
  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('profile', file);
    setProfileName(file?.name || null);
  };
  const removeProfile = () => {
    setData('profile', null);
    setProfileName(null);
  };

  const handleCertificates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('certificates', files);
    setNewCertNames(files.map(f => f.name));
  };
  const removeNewCert = (idx: number) => {
    const updated = data.certificates.filter((_, i) => i !== idx);
    setData('certificates', updated);
    setNewCertNames(updated.map(f => f.name));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('images', files);
    const urls = files.map(f => URL.createObjectURL(f));
    setNewImagePreviews(urls);
  };
  const removeNewImage = (idx: number) => {
    const updated = data.images.filter((_, i) => i !== idx);
    setData('images', updated);
    setNewImagePreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const openImagePreview = (src: string) => {
    setSelectedImage(src);
    setShowImageModal(true);
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('factory-categories.store'), { name: newCat }, {
      onSuccess: () => {
        setShowCatModal(false);
        setNewCat('');
        router.reload({ only: ['categories'], preserveState: true });
      },
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('factories.update', factory.id), { forceFormData: true });
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => newImagePreviews.forEach(URL.revokeObjectURL);
  }, [newImagePreviews]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Factories', href: route('factories.index') },
        { title: 'Edit', href: route('factories.edit', factory.id) },
      ]}
    >
      <Head title="Edit Factory" />

      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <HeadingSmall
            title="Edit Factory"
            description={`Modify details for "${factory.name}"`}
            className="mb-8"
          />

          <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Factory Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.currentTarget.value)}
                  className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter factory name"
                />
                <InputError message={errors.name} />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={e => setData('address', e.currentTarget.value)}
                  className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
                <InputError message={errors.address} />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium text-gray-700">Contact</Label>
                <Input
                  id="contact"
                  value={data.contact}
                  onChange={e => setData('contact', e.currentTarget.value)}
                  className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact details"
                />
                <InputError message={errors.contact} />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-sm font-medium text-gray-700">Category</Label>
                <div className="flex space-x-2">
                  <select
                    id="category_id"
                    className="flex-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={data.category_id}
                    onChange={e => setData('category_id', e.currentTarget.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCatModal(true)}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </Button>
                </div>
                <InputError message={errors.category_id} />
              </div>

              {/* Compliance */}
              <div className="space-y-2">
                <Label htmlFor="compliance" className="text-sm font-medium text-gray-700">Compliance</Label>
                <Input
                  id="compliance"
                  value={data.compliance}
                  onChange={e => setData('compliance', e.currentTarget.value)}
                  className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter compliance details"
                />
                <InputError message={errors.compliance} />
              </div>

              {/* Production Capacity */}
              <div className="space-y-2">
                <Label htmlFor="production_capacity" className="text-sm font-medium text-gray-700">Production Capacity</Label>
                <Input
                  id="production_capacity"
                  type="number"
                  value={data.production_capacity}
                  onChange={e => setData('production_capacity', e.currentTarget.value)}
                  className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter capacity"
                />
                <InputError message={errors.production_capacity} />
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
              {/* Profile */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Profile (PDF)</Label>
                {profileName && (
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span className="text-sm italic text-gray-600">{profileName}</span>
                    <button type="button" onClick={removeProfile} className="text-red-600 hover:text-red-800">
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleProfile}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <InputError message={errors.profile} />
              </div>

              {/* Existing Certificates */}
              {existingCerts.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Existing Certificates</Label>
                  <div className="space-y-2">
                    {existingCerts.map(c => (
                      <div key={c.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                        <a href={`/storage/${c.file_path}`} target="_blank" className="text-sm text-blue-600 hover:underline">
                          {c.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Certificates */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Upload Certificates</Label>
                <div className="space-y-2">
                  {newCertNames.map((n, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                      <span className="text-sm italic text-gray-600">{n}</span>
                      <button type="button" onClick={() => removeNewCert(i)} className="text-red-600 hover:text-red-800">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png"
                  onChange={handleCertificates}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <InputError message={errors.certificates} />
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Existing Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingImages.map(img => (
                      <div key={img.id} className="relative w-full aspect-square">
                        <img
                          src={`/storage/${img.file_path}`}
                          alt={img.alt_text}
                          className="object-cover w-full h-full rounded-md cursor-pointer"
                          onClick={() => openImagePreview(`/storage/${img.file_path}`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Upload Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {newImagePreviews.map((src, i) => (
                    <div key={i} className="relative w-full aspect-square">
                      <img
                        src={src}
                        className="object-cover w-full h-full rounded-md cursor-pointer"
                        onClick={() => openImagePreview(src)}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <InputError message={errors.images} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Save Changes
                </Button>
                <Link
                  href={route('factories.index')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Link>
              </div>
              {recentlySuccessful && (
                <p className="text-sm text-green-600">Changes saved successfully!</p>
              )}
            </div>
          </form>
        </div>

        {/* New Category Modal */}
        <Transition appear show={showCatModal} as={Fragment}>
          <Dialog className="relative z-20" onClose={() => setShowCatModal(false)}>
            <div className="fixed inset-0 bg-black/25" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg border border-gray-200 w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-gray-900">Add New Category</Dialog.Title>
                <form onSubmit={addCategory} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCat" className="text-sm font-medium text-gray-700">Category Name</Label>
                    <Input
                      id="newCat"
                      value={newCat}
                      onChange={e => setNewCat(e.currentTarget.value)}
                      className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter category name"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCatModal(false)}
                      className="border-gray-300 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add Category
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>

        {/* Image Preview Modal */}
        <Transition appear show={showImageModal} as={Fragment}>
          <Dialog className="relative z-30" onClose={() => setShowImageModal(false)}>
            <div className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-4 rounded-lg border border-gray-200 max-w-3xl w-full">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Image Preview"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-md"
                  />
                )}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowImageModal(false)}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
    </AppLayout>
  );
}