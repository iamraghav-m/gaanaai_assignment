
import React from "react";
import { Button } from "@/components/ui/button";
import { Port } from "@/types/table";
import { Input } from "@/components/ui/input";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Port>) => void;
  initialData?: Partial<Port>;
  title: string;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [formData, setFormData] = React.useState<Partial<Port>>(
    initialData || {
      name: "",
      country: "",
      continent: "",
      province: "",
      timezone: "",
      code: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      unlocs: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleChange(e, "name")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={formData.country || ""}
                onChange={(e) => handleChange(e, "country")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Continent</label>
              <Input
                value={formData.continent || ""}
                onChange={(e) => handleChange(e, "continent")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <Input
                value={formData.province || ""}
                onChange={(e) => handleChange(e, "province")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <Input
                value={formData.timezone || ""}
                onChange={(e) => handleChange(e, "timezone")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <Input
                value={formData.code || ""}
                onChange={(e) => handleChange(e, "code")}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <Input
                  type="number"
                  value={formData.coordinates?.latitude || 0}
                  onChange={(e) => handleChange(e, "coordinates.latitude")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <Input
                  type="number"
                  value={formData.coordinates?.longitude || 0}
                  onChange={(e) => handleChange(e, "coordinates.longitude")}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormDialog;
