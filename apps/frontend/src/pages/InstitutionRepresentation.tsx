import { useState, useEffect } from "react";
import { useInstitutions } from "@/hooks/useInstitutions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, School, Building2, Navigation, List } from "lucide-react";
import { Institution } from "@/interfaces/institution";

const InstitutionRepresentation = () => {
  const { Institutions, isLoading } = useInstitutions();
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  // Coordonnées de Ngaoundéré, Cameroun
  const NGAOUNDERE_COORDS = { lat: 7.3167, lng: 13.5833 };

  // Obtenir la géolocalisation de l'utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError("Impossible d'obtenir votre position");
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const schools = Institutions?.filter((inst) => inst.type === "école") || [];
  const faculties =
    Institutions?.filter((inst) => inst.type === "faculté") || [];

  return (
    <div className="h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 rounded-lg bg-primary/10">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Représentation Géographique</h1>
          <p className="text-sm text-muted-foreground">
            Localisation des {Institutions?.length || 0} institution(s)
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 overflow-hidden">
        {/* Colonne gauche: Liste des institutions */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
          {/* Carte de localisation utilisateur */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                <CardTitle>Votre position</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {userLocation ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Position détectée
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Lat: {userLocation.lat.toFixed(4)}
                      <br />
                      Lng: {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {locationError || "Détection en cours..."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des écoles */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                <CardTitle>Écoles ({schools.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {schools.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedInst?.id === inst.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                  >
                    <p className="font-medium text-sm">{inst.abbreviation}</p>
                    <p className="text-xs opacity-80 truncate">
                      {inst.fullname}
                    </p>
                  </button>
                ))}
                {schools.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune école
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Liste des facultés */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>Facultés ({faculties.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {faculties.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedInst?.id === inst.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                  >
                    <p className="font-medium text-sm">{inst.abbreviation}</p>
                    <p className="text-xs opacity-80 truncate">
                      {inst.fullname}
                    </p>
                  </button>
                ))}
                {faculties.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune faculté
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: Carte et détails */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* Carte statique simulée */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Carte de Ngaoundéré</CardTitle>
                </div>
                {selectedInst && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInst(null)}
                  >
                    Désélectionner
                  </Button>
                )}
              </div>
              <CardDescription>
                Localisation des institutions à l'Université de Ngaoundéré
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {/* Carte statique avec iframe OpenStreetMap */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-border">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    NGAOUNDERE_COORDS.lng - 0.05
                  },${NGAOUNDERE_COORDS.lat - 0.05},${
                    NGAOUNDERE_COORDS.lng + 0.05
                  },${NGAOUNDERE_COORDS.lat + 0.05}&layer=mapnik&marker=${
                    NGAOUNDERE_COORDS.lat
                  },${NGAOUNDERE_COORDS.lng}`}
                  style={{ border: 0 }}
                  title="Carte de Ngaoundéré"
                ></iframe>
                {userLocation && (
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Vous êtes ici</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Détails de l'institution sélectionnée */}
          {selectedInst && (
            <Card>
              <CardHeader>
                <CardTitle>Institution sélectionnée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Nom complet
                    </p>
                    <p className="font-semibold">{selectedInst.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Abréviation
                    </p>
                    <p className="font-semibold">{selectedInst.abbreviation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <p className="font-semibold capitalize">
                      {selectedInst.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hôte</p>
                    <p className="font-semibold">{selectedInst.host || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Enseignants
                    </p>
                    <p className="font-semibold">
                      {selectedInst.teachers?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Note d'information */}
      {/* <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> Pour une carte interactive complète, installez <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">react-leaflet</code>.
          La carte actuelle utilise OpenStreetMap en mode embarqué.
        </p>
      </div> */}
    </div>
  );
};

export default InstitutionRepresentation;
