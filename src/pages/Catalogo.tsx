import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import './Catalogo.css';
import { cartOutline, addCircleOutline, removeCircleOutline } from "ionicons/icons";

// 1. Tipos
interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

const CatalogoTienda: React.FC = () => {
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  // 2. Productos
  const productos: Producto[] = [
    { id: 1, nombre: "Camiseta Azul", precio: 45000 },
    { id: 2, nombre: "Pantalón Negro", precio: 80000 },
    { id: 3, nombre: "Zapatos Running", precio: 120000 },
    { id: 4, nombre: "Pantaloneta Running", precio: 120000 },
    { id: 5, nombre: "Gorra", precio: 120000 },
    { id: 6, nombre: "Kit de seguridad", precio: 120000 },
    { id: 7, nombre: "Casco", precio: 120000 }
  ];

  // 3. Agregar al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // 4. Modificar cantidad
  const modificarCantidad = (id: number, cantidad: number) => {
    setCarrito(
      carrito
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // 5. Total
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <IonPage>
      {/* Header */}
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">🛍️ Catálogo Eco-Sport</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            onClick={() => setCarritoVisible(!carritoVisible)}
          >
            <IonIcon icon={cartOutline} />
            {carrito.length > 0 && (
              <IonBadge color="danger">{carrito.reduce((a, i) => a + i.cantidad, 0)}</IonBadge>
            )}
          </IonButton>
        </IonToolbar>
      </IonHeader>

      {/* Contenido */}
      <IonContent fullscreen className="catalogo-background">
        {!carritoVisible ? (
          <div className="productos-grid">
            {productos.map((producto) => (
              <IonCard key={producto.id} className="producto-card">
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center">
                    {producto.nombre}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="producto-imagen">🛒</div>
                  <p className="ion-text-center">
                    <strong>${producto.precio.toLocaleString()}</strong>
                  </p>
                  <IonButton
                    expand="block"
                    shape="round"
                    className="ion-margin-top"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : (
          <IonCard className="carrito-card">
            <IonCardHeader>
              <IonCardTitle>🛒 Tu carrito</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {carrito.length === 0 ? (
                <p>No has agregado productos.</p>
              ) : (
                <>
                  <IonList>
                    {carrito.map((item) => (
                      <IonItem key={item.id}>
                        <IonLabel>
                          {item.nombre} (x{item.cantidad})
                        </IonLabel>
                        <IonButton
                          fill="clear"
                          onClick={() => modificarCantidad(item.id, -1)}
                        >
                          <IonIcon icon={removeCircleOutline} />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          onClick={() => modificarCantidad(item.id, 1)}
                        >
                          <IonIcon icon={addCircleOutline} />
                        </IonButton>
                        <IonLabel slot="end">
                          ${(item.precio * item.cantidad).toLocaleString()}
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                  <h3 className="ion-text-right ion-margin-top">
                    <strong>Total: ${total.toLocaleString()}</strong>
                  </h3>
                </>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>


    </IonPage>
  );
};

export default CatalogoTienda;

