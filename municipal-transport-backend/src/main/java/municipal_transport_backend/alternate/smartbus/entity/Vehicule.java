package municipal_transport_backend.alternate.smartbus.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicule")
public class Vehicule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String marque;
    
    private String modele;
    
    @Column(name = "type_vehicule")
    private String typeVehicule;
    
    private String etat;
    
    @Column(name = "vehiculeDispo")
    private boolean vehiculeDispo;
    
    @Column(name = "matriculeFourni", unique = true)
    private String matriculeFourni;
    
    private String localisation;
    
    private Integer kilometrage;
    
    @Column(name = "date_fin_assurance")
    private LocalDate dateFinAssurance;
    
    @Column(name = "date_prochain_ct")
    private LocalDate dateProchainCt;
    
    @Column(name = "date_premiere_mise_circulation")
    private LocalDate datePremiereMiseCirculation;
    
    private String carburant;
    
    @Column(name = "date_validite_exploitation")
    private LocalDate dateValiditeExploitation;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
    
    // Constructeurs
    public Vehicule() {}
    
    public Vehicule(String marque, String modele, String typeVehicule, String etat, 
                    boolean vehiculeDispo, String matriculeFourni, String localisation, 
                    Integer kilometrage, LocalDate dateFinAssurance, LocalDate dateProchainCt,
                    LocalDate datePremiereMiseCirculation, String carburant, 
                    LocalDate dateValiditeExploitation) {
        this.marque = marque;
        this.modele = modele;
        this.typeVehicule = typeVehicule;
        this.etat = etat;
        this.vehiculeDispo = vehiculeDispo;
        this.matriculeFourni = matriculeFourni;
        this.localisation = localisation;
        this.kilometrage = kilometrage;
        this.dateFinAssurance = dateFinAssurance;
        this.dateProchainCt = dateProchainCt;
        this.datePremiereMiseCirculation = datePremiereMiseCirculation;
        this.carburant = carburant;
        this.dateValiditeExploitation = dateValiditeExploitation;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    
    public String getModele() { return modele; }
    public void setModele(String modele) { this.modele = modele; }
    
    public String getTypeVehicule() { return typeVehicule; }
    public void setTypeVehicule(String typeVehicule) { this.typeVehicule = typeVehicule; }
    
    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }
    
    public boolean isVehiculeDispo() { return vehiculeDispo; }
    public void setVehiculeDispo(boolean vehiculeDispo) { this.vehiculeDispo = vehiculeDispo; }
    
    public String getMatriculeFourni() { return matriculeFourni; }
    public void setMatriculeFourni(String matriculeFourni) { this.matriculeFourni = matriculeFourni; }
    
    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }
    
    public Integer getKilometrage() { return kilometrage; }
    public void setKilometrage(Integer kilometrage) { this.kilometrage = kilometrage; }
    
    public LocalDate getDateFinAssurance() { return dateFinAssurance; }
    public void setDateFinAssurance(LocalDate dateFinAssurance) { this.dateFinAssurance = dateFinAssurance; }
    
    public LocalDate getDateProchainCt() { return dateProchainCt; }
    public void setDateProchainCt(LocalDate dateProchainCt) { this.dateProchainCt = dateProchainCt; }
    
    public LocalDate getDatePremiereMiseCirculation() { return datePremiereMiseCirculation; }
    public void setDatePremiereMiseCirculation(LocalDate datePremiereMiseCirculation) { this.datePremiereMiseCirculation = datePremiereMiseCirculation; }
    
    public String getCarburant() { return carburant; }
    public void setCarburant(String carburant) { this.carburant = carburant; }
    
    public LocalDate getDateValiditeExploitation() { return dateValiditeExploitation; }
    public void setDateValiditeExploitation(LocalDate dateValiditeExploitation) { this.dateValiditeExploitation = dateValiditeExploitation; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
