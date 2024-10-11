import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../../utils/apiUrl';
import { renderWithTooltip } from '../../../utils/renderWithTooltip';
import { TextInput,Select,Label, Textarea ,Modal } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineArrowNarrowRight } from "react-icons/hi";
import Layout from "../../layout/layout";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { Button } from "flowbite-react";
import { FilterMatchMode } from 'primereact/api';
import 'flowbite/dist/flowbite.css';
import '../styles.css';
import {TableActionsItemsActive} from '../../../utils/TableActions';
import ConfirmacionModal from '../../../utils/ConfirmacionModal';
import ToastNotification from '../../../utils/ToastNotification';
import {jwtDecode} from 'jwt-decode';
import fotoCard  from "../../../img/f0054102.jpg";
import { Card } from "flowbite-react";
import { HiPencil, HiTrash,HiRefresh, HiEye  } from "react-icons/hi";
import { Datepicker } from "flowbite-react";
import { Tooltip } from 'flowbite-react';

const TarjetasMagneticas = () => {
    
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const rol = decodedToken.role;
    const unidad_name = decodedToken.unidad_name;
    const unidad_id = decodedToken.unidad_id;
  
    const [loading, setLoading] = useState(true);
    const [flippedCards, setFlippedCards] = useState({});
    const [tarjetas, setTarjetas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showToastSUCC, setShowToastSUCC] = useState(false);
    const [showToastERR, setShowToastERR] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [openEdtModal, setOpenEdtModal] = useState(false);

    const [colorInputText, setcolorInputText] = useState('gray');
    const [msgInputText, setmsgInputText] = useState('');

    const [colorInputDate, setcolorInputDate] = useState('gray');
    const [msgInputDate, setmsgInputDate] = useState('');

    const [colorInputTextEdt, setcolorInputTextEdt] = useState('gray');
    const [msgInputTextEdt, setmsgInputTextEdt] = useState('');
    
  
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    var vehiculo_seleccionado = 0;
    
    const [formData, setFormData] = useState({
        identificador: '',
        fecha_vencimiento: '',
        estado: '',
        saldo: '',
        vehiculo_id:'',
        unidad_id:'',
    });
    

    const resetFormData = () => {
        setFormData({
            identificador: '',
            fecha_vencimiento: '',
            estado: '',
            saldo: '',
            vehiculo_id:'',
            unidad_id:'',
            });
        };
      
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCardInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
      
        // Agregar espacio después de cada grupo de 4 dígitos
        if (value.length > 4) value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      
        setFormData({
          ...formData,
          identificador: value,  // Actualizar el valor formateado
        });
      };

    const handleSearch = (event) => {
        const term = event.target.value.trim().toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);
    };
  
    const handleFlip = (id) => {
      setFlippedCards(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    };

    function formatearFecha(fechaStr) {
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      
      // Convertir la cadena a un objeto Date
      const [year, month, day] = fechaStr.split('-');
      const fecha = new Date(year, month - 1, day);
      
      // Formatear la fecha como "día de mes de año"
      const dia = fecha.getDate();
      const mes = meses[fecha.getMonth()];
      const anio = fecha.getFullYear();
      
      return `${dia} de ${mes} de ${anio}`;
  }
    //vehiculos
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${apiUrl}/vehiculo/unidad/${unidad_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
            setVehiculos(sortedVehiculos);
            setLoading(false);
        })
        .catch(error => {
            const errorMsg = error.response?.data?.detail || 'Error al cargar los datos';
            if (errorMsg === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true);
                setTimeout(() => {
                    setShowToastERR(false);
                    localStorage.setItem('rol', '');
                    logout();
                    navigate('/login');
                }, 3000);
            } else {
                setToastMessage(errorMsg);
                setShowToastERR(true);
                setTimeout(() => {
                    setShowToastERR(false);
                    if (error.response.data.detail === 'No tiene permisos para acceder a esta ruta') {
                    // Token inválido o expirado, redirigir a la página de inicio de sesión
                    
                    navigate('/');
                    }
                }, 3000); 
            }
            setLoading(false);
            setTimeout(() => setShowToastERR(false), 5000);
        });
    }, []);

    //Add
    const handleSubmit = (e) => {
      e.preventDefault();

      
      if(!(/^\d+(\.\d+)?$/.test(formData.saldo))){
          setcolorInputText('failure');
          setmsgInputText('Para los lugares decimales utilize . solo una vez');
          
          setTimeout(() => {
              setShowToastERR(false);
              setcolorInputText('gray');
              setmsgInputText('');
          }
          , 5000);
          
          return;
      }

      if(formData.fecha_vencimiento == ''){
        setcolorInputDate('failure');
          setmsgInputDate('Escoja una fecha');
          
          setTimeout(() => {
              setShowToastERR(false);
              setcolorInputDate('gray');
              setmsgInputDate('');
          }
          , 5000);
          
          return;
      }

      
      const token = localStorage.getItem('token');
      axios.post(`${apiUrl}/tarjeta_magnetica/`, {
          identificador: formData.identificador.replace(/\s+/g, ''),
          fecha_vencimiento: formData.fecha_vencimiento,
          estado: formData.estado,
          saldo: formData.saldo,
          vehiculo_id: formData.vehiculo_id,
          unidad_id: unidad_id
      }, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => {
          setTarjetas([response.data.tarjeta_magnetica,...tarjetas]);
          resetFormData();
          setSearchTerm('');
          setCurrentPage(1);
          const token = localStorage.getItem('token');
                  axios.get(`${apiUrl}/vehiculo/unidad/${unidad_id}`, {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  })
                  .then(response => {
                      const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
                      setVehiculos(sortedVehiculos);
                     
                  })
                  .catch(error => {
                      const errorMsg = error.response?.data?.detail || 'Error al obtener los modelos';
                      setToastMessage(errorMsg);
                      setShowToastERR(true);
                      setTimeout(() => setShowToastERR(false), 5000);
                  });

          setToastMessage(response.data.message);
          setShowToastSUCC(true);
          setTimeout(() => setShowToastSUCC(false), 5000);
          setOpenNewModal(false);
          
      })
      .catch(error => {
          resetFormData();
          console.log(formData.identificador.trim());
          setOpenNewModal(false);
          
          console.log(error);
          if (error.response.data.detail === 'Could not validate credentials') {
              setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
              setShowToastERR(true);
              setTimeout(() => {
                  setShowToastERR(false);
                  localStorage.setItem('rol', '');
                  logout();
                  navigate('/login');
              }, 3000);
          } else {
              setToastMessage(error.response.data.detail);
              setShowToastERR(true);
              setTimeout(() => setShowToastERR(false), 5000);
          }
      });
    };

    //Edt
    const openModalWithData = (userId) => {
        
        setSelectedId(userId);
        fetchUserData(userId);
        
        setOpenEdtModal(true);
        
    };

    useEffect(() => {
        if (selectedId !== null) {
            fetchUserData(selectedId);
            
           
                
           
        }
    }, [selectedId]);

    

    const fetchUserData = async (selectedId) => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        
        await axios.get(`${apiUrl}/tarjeta_magnetica/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluir el token en los encabezados
            }
        })
            .then(response => {
                
                vehiculo_seleccionado = response.data.vehiculo_id;
                console.log(vehiculo_seleccionado);
                setFormData({
                    identificador: response.data.identificador.substring(0, 4)+" "+response.data.identificador.substring(4, 8)+" "+response.data.identificador.substring(8, 12)+" "+response.data.identificador.substring(12, 16),
                    fecha_vencimiento: response.data.fecha_vencimiento,
                    estado: response.data.estado,
                    saldo: response.data.saldo,
                    vehiculo_id: response.data.vehiculo_id,
                    unidad_id: response.data.unidad_id,
                });

                localStorage.setItem('vehiculo_seleccionado',response.data.vehiculo_id);
                localStorage.setItem('fecha_vencimiento',response.data.fecha_vencimiento);
                
                
            })
            .catch(error => {
              
              if (error.response.data.detail === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true); // Mostrar Toast
                setTimeout(() => setShowToastERR(false), 5000); 
                setTimeout(() => {
                    setShowToastERR(false);
                    if (error.response.data.detail === 'Could not validate credentials') {
                      // Token inválido o expirado, redirigir a la página de inicio de sesión
                      localStorage.setItem('rol', '');
                      logout();
                      navigate('/login');
                    }
                  }, 3000);
                }else{
                    setToastMessage(error.response.data.detail);
                    setShowToastERR(true); // Mostrar Toast
                    setTimeout(() => setShowToastERR(false), 5000); 
                }
            
            // 2 segundos de retraso antes de la redirección
             
            });
    };
    
    const handleEdtSubmit = (e) => {
        e.preventDefault();

        
        if(!(/^\d+(\.\d+)?$/.test(formData.saldo))){
            setcolorInputTextEdt('failure');
            setmsgInputTextEdt('Para los lugares decimales utilize . solo una vez');
            
            setTimeout(() => {
                setShowToastERR(false);
                setcolorInputTextEdt('gray');
                setmsgInputTextEdt('');
            }
            , 5000);
            
            return;
        }

        console.log(formData.fecha_vencimiento);

        const token = localStorage.getItem('token');
        axios.put(`${apiUrl}/tarjeta_magnetica/${selectedId}`, {
            identificador: formData.identificador.replace(/\s+/g, ''),
            fecha_vencimiento: formData.fecha_vencimiento,
            estado: formData.estado,
            saldo: formData.saldo,
            vehiculo_id: formData.vehiculo_id,
            unidad_id: unidad_id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setTarjetas((prevTarjetas) => 
                prevTarjetas.map(tarjeta => tarjeta.id === selectedId ? response.data.tarjeta_magnetica : tarjeta)
            );

            const token = localStorage.getItem('token');
                    axios.get(`${apiUrl}/vehiculo/unidad/${unidad_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
                        setVehiculos(sortedVehiculos);
                       
                    })
                    .catch(error => {
                        const errorMsg = error.response?.data?.detail || 'Error al obtener los modelos';
                        setToastMessage(errorMsg);
                        setShowToastERR(true);
                        setTimeout(() => setShowToastERR(false), 5000);
                    });

            setToastMessage(response.data.message);
            setShowToastSUCC(true);
            setTimeout(() => setShowToastSUCC(false), 5000);
            setOpenEdtModal(false);
            resetFormData();
        })
        .catch(error => {
            console.log(formData.identificador.trim());
            setOpenEdtModal(false);
            resetFormData();
            console.log(error);
            if (error.response.data.detail === 'Could not validate credentials') {
                setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                setShowToastERR(true);
                setTimeout(() => {
                    setShowToastERR(false);
                    localStorage.setItem('rol', '');
                    logout();
                    navigate('/login');
                }, 3000);
            } else {
                setToastMessage(error.response.data.detail);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            }
        });
    };
    
    //Delete
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    const confirmDelete = () => {
        const token = localStorage.getItem('token');
        axios.delete(`${apiUrl}/tarjeta_magnetica/${selectedId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const updatedTarjetas = tarjetas.filter(tarjeta => tarjeta.id !== selectedId);
        const filteredResults = updatedTarjetas.filter(tarjeta =>
            tarjeta.identificador.toLowerCase().includes(searchTerm) ||
            tarjeta.tipo_portador.nombre.toLowerCase().includes(searchTerm) || 
            tarjeta.vehiculo.matricula.toLowerCase().includes(searchTerm) || 
            tarjeta.estado.toLowerCase().includes(searchTerm) ||
            tarjeta.saldo.toString().includes(searchTerm) ||  
            tarjeta.fecha_vencimiento.toLowerCase().includes(searchTerm)
        );
        
        const totalPagesAfterDelete = Math.ceil(filteredResults.length / itemsPerPage);

        // Si estamos en la última página de la búsqueda y eliminamos la última tarjeta de esa página
        if (filteredResults.length === 0 ) {
            // Limpiar la búsqueda y volver a la página principal
            setSearchTerm(""); // Esto limpia la búsqueda
            setCurrentPage(1);  // Esto te redirige a la página principal
        } 
        // Si eliminamos la última tarjeta de una página y no estamos en la primera página
        else if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
            setCurrentPage(currentPage - 1); // Redirigir a la página anterior
        }

                setTarjetas(tarjetas.filter(tarjeta => tarjeta.id !== selectedId));

                
                    const token = localStorage.getItem('token');
                    axios.get(`${apiUrl}/vehiculo/unidad/${unidad_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        const sortedVehiculos = response.data.sort((a, b) => b.id - a.id);
                        setVehiculos(sortedVehiculos);
                       
                    })
                    .catch(error => {
                        const errorMsg = error.response?.data?.detail || 'Error al obtener los modelos';
                        setToastMessage(errorMsg);
                        setShowToastERR(true);
                        setTimeout(() => setShowToastERR(false), 5000);
                    });
                
                resetFormData();
                setOpenModal(false);
                setToastMessage(response.data.message);
                setShowToastERR(true);
                setTimeout(() => setShowToastERR(false), 5000);
            })
            .catch(error => {
                setOpenModal(false);
                const errorMsg = error.response?.data?.detail || 'Error al actualizar el estado';
                if (errorMsg === 'Could not validate credentials') {
                    setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
                    setShowToastERR(true);
                    setTimeout(() => {
                        setShowToastERR(false);
                        localStorage.setItem('rol', '');
                        logout();
                        navigate('/login');
                    }, 3000);
                } else {
                    setToastMessage(errorMsg);
                    setShowToastERR(true);
                    setTimeout(() => setShowToastERR(false), 5000);
                }
            });
    };

    

    //Tarjetas
    const itemsPerPage = 6;
    const filteredTarjetas = tarjetas.filter(tarjeta => {
        // Eliminar espacios en blanco y convertir a minúsculas
        const searchTermClean = searchTerm.replace(/\s+/g, '').toLowerCase();
        const identificador = tarjeta.identificador.replace(/\s+/g, '').toLowerCase();
        const tipoPortador = tarjeta.tipo_portador.nombre.replace(/\s+/g, '').toLowerCase();
        const matricula = tarjeta.vehiculo.matricula.replace(/\s+/g, '').toLowerCase();
        const estado = tarjeta.estado.replace(/\s+/g, '').toLowerCase();
        const fechaVencimiento = tarjeta.fecha_vencimiento.replace(/\s+/g, '').toLowerCase();
        const saldo = tarjeta.saldo.toString().replace(/\s+/g, '');
      
        // Realiza la comparación con el término de búsqueda limpio
        return (
          identificador.includes(searchTermClean) ||
          tipoPortador.includes(searchTermClean) ||
          matricula.includes(searchTermClean) ||
          estado.includes(searchTermClean) ||
          saldo.includes(searchTermClean) ||
          fechaVencimiento.includes(searchTermClean)
        );
      });
    const totalPages = Math.ceil(filteredTarjetas.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTarjetas = filteredTarjetas.slice(indexOfFirstItem, indexOfLastItem);
  
    const onPageChange = (page) => setCurrentPage(page);
  
    useEffect(() => {
      axios.get(`${apiUrl}/tarjeta_magnetica/unidad/${unidad_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const sortedTarjetas = response.data.sort((a, b) => b.id - a.id);
        setTarjetas(sortedTarjetas);
        setLoading(false);
      })
      .catch(error => {
        const errorMsg = error.response?.data?.detail || 'Error al cargar los datos';
        if (errorMsg === 'Could not validate credentials') {
          setToastMessage('Su sesión ha expirado, por favor ingrese de nuevo');
          setShowToastERR(true);
          setTimeout(() => {
            setShowToastERR(false);
            localStorage.setItem('rol', '');
            logout();
            navigate('/login');
          }, 3000);
        } else {
          setToastMessage(errorMsg);
          setShowToastERR(true);
          setTimeout(() => {
            setShowToastERR(false);
            if (error.response.data.detail === 'No tiene permisos para acceder a esta ruta') {
              navigate('/');
            }
          }, 3000);
        }
        setLoading(false);
        setTimeout(() => setShowToastERR(false), 5000);
      });
    }, [unidad_id, token, navigate, logout]);
  
    const renderVehIculo = () => (
      <div className="container mx-auto h-auto px-4">
        <h5 className="text-2xl font-bold text-cyan-700 dark:text-white">
          Tarjetas Magnéticas - Unidad: {unidad_name}
        </h5>
  
        <br />
  
        <div className="flex items-center justify-between mb-1">
          {/* Botón en el lado izquierdo */}
          <Button onClick={() => setOpenNewModal(true)} className="mb-1">
            Nueva Tarjeta <HiOutlinePlus className="ml-2 h-5 w-5" />
          </Button>
  
          {/* Input de texto en el lado derecho */}
          <TextInput
            id="email1"
            placeholder="Buscar"
            icon={HiOutlineSearch}
            onChange={handleSearch}
            className="ml-4 w-full max-w-xs"
          />
        </div>
  
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1">
          {currentTarjetas.map(tarjeta => (
            <div key={tarjeta.id} className="relative max-w-sm min-h-44 perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-1000 transform-style-preserve-3d`}
                style={{
                  transform: flippedCards[tarjeta.id] ? 'rotateY(3.142rad)' : 'rotateY(0)',
                }}
              >
                {/* Cara frontal de la tarjeta */}
                <Card imgSrc={fotoCard} className={`absolute inset-0 backface-hidden ${flippedCards[tarjeta.id] ? 'hidden' : ''}`}>
                  <div className="absolute inset-0">
                    <h1 className="text-lg tracking-tight text-center text-gray-900 dark:text-gray-900 absolute bottom-14 left-1/2 transform -translate-x-1/2">
                      {`${tarjeta.identificador.substring(0, 4)} ${tarjeta.identificador.substring(4, 8)} ${tarjeta.identificador.substring(8, 12)} ${tarjeta.identificador.substring(12)}`}
                    </h1>
                    <p className="font-semibold text-gray-700 dark:text-gray-700 absolute top-36 left-4">
                      VENCE: {`${tarjeta.fecha_vencimiento.substring(5, 7)}/${tarjeta.fecha_vencimiento.substring(2, 4)}`}
                    </p>
                    <div className="flex justify-end gap-2 mt-36 mr-4">
                      <Tooltip content="Ver" placement="top">
                        <HiEye className="h-6 w-6 cursor-pointer" onClick={() => handleFlip(tarjeta.id)} />
                      </Tooltip>
                      <Tooltip content="Editar" placement="top">
                        <HiPencil className="h-6 w-6 cursor-pointer" onClick={() => openModalWithData(tarjeta.id)} />
                      </Tooltip>
                      <Tooltip content="Eliminar" placement="top">
                        <HiTrash className="h-6 w-6 cursor-pointer" onClick={() => handleDeleteClick(tarjeta.id)}/>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
  
                {/* Cara trasera de la tarjeta */}
                <div
                  className={`absolute inset-0 backface-hidden transform rotateY(180deg) p-4 bg-gray-200 dark:bg-gray-800 rounded-lg ${flippedCards[tarjeta.id] ? '' : 'hidden'}`}
                  style={{ transform: 'rotateY(3.142rad)' }}
                >
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Propietario: {unidad_name}</h2>
                  <div className="grid gap-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
                    <p className="text-gray-700 dark:text-gray-400">Estado: {tarjeta.estado}</p>
                    <p className="text-gray-700 dark:text-gray-400">Vehículo: {tarjeta.vehiculo.matricula}</p>
                    <p className="text-gray-700 dark:text-gray-400">Saldo: ${tarjeta.saldo}</p>
                    <p className="text-gray-700 dark:text-gray-400">Expira: {tarjeta.fecha_vencimiento}</p>
                    <p className="text-gray-700 dark:text-gray-400">Combustible: {tarjeta.tipo_portador.nombre}</p>
                    <button
                      onClick={() => handleFlip(tarjeta.id)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4">
            <div className="flex-shrink-0">
                <Button>
                Total de Tarjetas: {tarjetas.length}
                </Button>
            </div>

            <div className="flex-grow flex justify-center mr-28">
                <Pagination
                layout="table"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons
                />
            </div>
        </div>

      </div>
    );
  
    return (
      <Layout>
        <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-y-auto">
          <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:p-6 dark:border-gray-700">
            {renderVehIculo()}
          </div>

          <ToastNotification show={showToastSUCC} type="success" message={toastMessage} onClose={() => setShowToastSUCC(false)} />
          <ToastNotification show={showToastERR} type="error" message={toastMessage} onClose={() => setShowToastERR(false)} />

          <Modal show={openNewModal}  size='md'onClose={() => {setOpenNewModal(false); resetFormData();}}>
                <Modal.Header onClose={() => { setOpenNewModal(false); resetFormData(); }}>
                    Nueva Tarjeta Magnética
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-4">
                            <div class="grid grid-cols-1 gap-1">
                                <div>
                                    <Label htmlFor="identificador">No. de Tarjeta</Label>
                                    <TextInput id="identificador" name="identificador" minLength = {19} maxLength={19} value={formData.identificador} onChange={handleCardInputChange} required onInvalid={(e) => e.target.setCustomValidity('La tarjete debe tener 16 digitos.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="fecha_vencimiento">Fecha de Vencimineto</Label>
                                    <Datepicker color={colorInputDate} language="es-ES" labelTodayButton="Hoy" labelClearButton="Limpiar" weekStart={1} id="fecha_vencimiento" name="fecha_vencimiento"
                                   helperText={
                                    <>
                                        <p>{msgInputDate}</p> 
                                    </>
                                }
                                    value={formData.fecha_vencimiento != '' ? formatearFecha(formData.fecha_vencimiento):''}
                                     onSelectedDateChanged={(date) => setFormData({ ...formData, fecha_vencimiento: date.toISOString().split('T')[0] })}   required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa la fecha de vencimiento.')} onInput={(e) => e.target.setCustomValidity('')}  />
                
                                </div>
                                <div>
                                    <Label htmlFor="saldo">Saldo</Label>
                                    <TextInput id="saldo" name="saldo" min='0' value={formData.saldo} color={colorInputText}
                                    helperText={
                                        <>
                                            <p>{msgInputText}</p> 
                                        </>
                                    }
                                    onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el monto del saldo, debe ser mayor que  0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                </div>
                                
                                <div>
                                    <Label htmlFor="estado">Estado</Label>
                                    <Select id="estado" name="estado" value={formData.estado} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un estado-</option>
                                            <option value="En uso">En uso</option>
                                            <option value="Reserva">Reserva</option>
                                    </Select>
                                </div>
                                
                                
                               
                                <div>
                                    <Label htmlFor="vehiculo_id">Vehículos disponibles para asociar la tarjeta</Label>
                                    <Select id="vehiculo_id" name="vehiculo_id" value={formData.vehiculo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un vehículo-</option>
                                            {vehiculos.map(vehiculo => (
                                                
                                                vehiculo.tarjeta_magnetica === null  ?
                                                
                                                    <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.matricula}</option>
                                                    :null
                                            ))}
                                    </Select> 
                                </div>
  
                            </div>
                            <Button type="submit">Guardar</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={openEdtModal}  size='md'onClose={() => {setOpenEdtModal(false); resetFormData();}}>
                <Modal.Header onClose={() => { setOpenEdtModal(false); resetFormData(); localStorage.setItem('fecha_vencimiento','') }}>
                    Editar Tarjeta Magnética
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEdtSubmit} className="space-y-4">
                            <div class="grid grid-cols-1 gap-1">
                                <div>
                                    <Label htmlFor="identificador">No. de Tarjeta</Label>
                                    <TextInput id="identificador" name="identificador" minLength = {19} maxLength={19} value={formData.identificador} onChange={handleCardInputChange} required onInvalid={(e) => e.target.setCustomValidity('La tarjete debe tener 16 digitos.')} onInput={(e) => e.target.setCustomValidity('')}/>
                                </div>
                                <div>
                                    <Label htmlFor="fecha_vencimiento">Fecha de Vencimineto</Label>
                                    <Datepicker 
                                        language="es-ES" 
                                        labelTodayButton="Hoy" 
                                        labelClearButton="Limpiar" 
                                        weekStart={1} 
                                        id="fecha_vencimiento" 
                                        name="fecha_vencimiento" 
                                        maxLength={30}
                                        //value={parseInt(formData.fecha_vencimiento.substring(0,4))}
                                        defaultDate={new Date(tarjetas.find(tarjeta => tarjeta.id == selectedId)?.fecha_vencimiento.substring(0, 4) || '',tarjetas.find(tarjeta => tarjeta.id == selectedId)?.fecha_vencimiento.substring(5, 7)-1 || '',tarjetas.find(tarjeta => tarjeta.id == selectedId)?.fecha_vencimiento.substring(8, 10))}

                                        onSelectedDateChanged={(date) => setFormData({ ...formData, fecha_vencimiento: date.toISOString().split('T')[0] })} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="saldo">Saldo</Label>
                                    <TextInput id="saldo" name="saldo" min='0' value={formData.saldo} color={colorInputTextEdt}
                                    helperText={
                                        <>
                                            <p>{msgInputTextEdt}</p> 
                                        </>
                                    }
                                    onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, ingresa el monto del saldo, debe ser mayor que  0.')} onInput={(e) => e.target.setCustomValidity('')} aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                </div>
                                
                                <div>
                                    <Label htmlFor="estado">Estado</Label>
                                    <Select id="estado" name="estado" value={formData.estado} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un estado-</option>
                                            <option value="En uso">En uso</option>
                                            <option value="Reserva">Reserva</option>
                                    </Select>
                                </div>
                                
                                
                               
                                <div>
                                    <Label htmlFor="vehiculo_id">Vehículos disponibles para asociar la tarjeta</Label>
                                    <Select id="vehiculo_id" name="vehiculo_id" value={formData.vehiculo_id} onChange={handleInputChange} required onInvalid={(e) => e.target.setCustomValidity('Por favor, seleccione un elemento.')} onInput={(e) => e.target.setCustomValidity('')}>
                                            <option value="">-Seleccione un vehículo-</option>
                                            {vehiculos.map(vehiculo => (
                                                
                                                vehiculo.tarjeta_magnetica === null || vehiculo.id == localStorage.getItem('vehiculo_seleccionado')  ?
                                                
                                                    <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.matricula}</option>
                                                    :null
                                            ))}
                                    </Select> 
                                </div>
  
                            </div>
                            <Button type="submit">Guardar</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <ConfirmacionModal show={openModal} onClose={() => setOpenModal(false)} onConfirm={confirmDelete} msg={'¿Desea eliminar esta tarjeta?'} />
        </section>
      </Layout>
    );
  };
  
  export default TarjetasMagneticas;