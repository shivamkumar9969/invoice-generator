import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import jsPDF from 'jspdf';

const AddProductPage = ({ setCurrentPage }) => {
    const location = useLocation();
    const { state: locationState } = location;
    const initialProducts = locationState?.products || [];
    const [products, setProducts] = useState(initialProducts);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [rate, setRate] = useState('');
    const [receipts, setReceipts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (locationState?.products) {
            setProducts(locationState.products);
        }
        fetchReceipts();
    }, [locationState]);

    const fetchReceipts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/receipts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReceipts(response.data);
        } catch (error) {
            console.error('Error fetching receipts:', error);
        }
    };

    const handleAddProduct = () => {
        if (!productName || !quantity || !rate) {
            alert('Please fill in all fields.');
            return;
        }
        if (quantity <= 0 || rate <= 0) {
            alert('Please enter a valid quantity and rate.');
            return;
        }

        const newProduct = {
            name: productName,
            qty: Number(quantity),
            rate: Number(rate),
            total: Number(quantity) * Number(rate),
        };
        setProducts([...products, newProduct]);
        setProductName('');
        setQuantity('');
        setRate('');
    };

    const handleDeleteProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const calculateTotalWithGST = () => {
        const totalWithoutGST = products.reduce((acc, product) => acc + product.total, 0);
        return totalWithoutGST * 1.18; // Adding 18% GST
    };

    const handleGenerateReceipt = () => {
        navigate('/receipt', { state: { products, totalWithGST: calculateTotalWithGST() } });
        setCurrentPage('receipt');
    };

    const handleDownloadReceipt = (receipt) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text('Levitation Infotec', 135, 20, null, null, 'left');

        // Product List
        let startY = 40;
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Product', 10, startY);
        doc.text('Qty', 60, startY);
        doc.text('Rate', 100, startY);
        doc.text('Total', 140, startY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        startY += 15;
        receipt.products.forEach((product, index) => {
            doc.text(product.name, 14, startY + index * 10);
            doc.setTextColor(0, 0, 255);
            doc.text(product.qty.toString(), 60, startY + index * 10);
            doc.setTextColor(0, 0, 0);
            doc.text(product.rate.toFixed(2), 100, startY + index * 10);
            doc.text(product.total.toFixed(2), 140, startY + index * 10);
        });

        // Total Section
        const totalWithoutGST = receipt.products.reduce((acc, product) => acc + product.total, 0);
        const GST = (totalWithoutGST * 0.18).toFixed(2);
        const grandTotal = receipt.totalWithGST.toFixed(2);

        const gap = 20; // Adjust the gap as needed

        startY += receipt.products.length * 10 + 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total INR:`, 120 - gap, startY);
        doc.text(`${totalWithoutGST.toFixed(2)}`, 140 + gap, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(`GST 18%:`, 120 - gap, startY + 10);
        doc.text(`${GST}`, 140 + gap, startY + 10);
        doc.text('------------------------------------------------------------', 120 - gap, startY + 15);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total:`, 120 - gap, startY + 20);
        doc.setTextColor(0, 0, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`${grandTotal}`, 140 + gap, startY + 20);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('---------------------------------------------------', 120 - gap, startY + 25);

        // Date
        const date = new Date(receipt.date).toLocaleDateString();
        doc.text(`Date: ${date}`, 14, startY + 40);

        // Save the PDF
        doc.save('receipt.pdf');
    };

    const handleDeleteReceipt = async (receiptId) => {
        try {
            console.log('Deleting receipt with ID:', receiptId); // Log receipt deletion attempt
            const token = localStorage.getItem('token'); // Retrieve authentication token
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/receipts/${receiptId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include authentication token in the request header
                }
            });

            if (response.status === 200) {
                console.log('Receipt deleted successfully');
                // Update the receipts state by filtering out the deleted receipt
                setReceipts(prevReceipts => prevReceipts.filter(receipt => receipt._id !== receiptId));
            }
        } catch (error) {
            console.error('Error deleting receipt:', error);
            // Optionally handle error (e.g., show error message to the user)
        }
    };



    return (
        <>
            <div className="max-w-md mx-auto mt-8 px-4 bg-white rounded-md shadow-md p-6">
                <h1 className="text-2xl flex justify-center font-bold mb-4">Add Products</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-600 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-600 rounded-md mb-2 focus:outline-none"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Rate"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-600 rounded-md mb-4 focus:outline-none"
                        required
                    />
                    <button
                        onClick={handleAddProduct}
                        className="block w-full mt-4 px-4 py-2 text-white bg-stone-700 rounded-md hover:bg-stone-800 focus:outline-none focus:bg-stone-800"
                    >
                        Add
                    </button>
                </div>
                {products.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-stone-600 mb-4">
                                <thead>
                                    <tr>
                                        <th className="border border-stone-600 px-4 py-2">Product</th>
                                        <th className="border border-stone-600 px-4 py-2">Qty</th>
                                        <th className="border border-stone-600 px-4 py-2">Rate</th>
                                        <th className="border border-stone-600 px-4 py-2">Total</th>
                                        <th className="border border-stone-600 px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td className="border border-stone-600 px-4 py-2">{product.name}</td>
                                            <td className="border border-stone-600 px-4 py-2">{product.qty}</td>
                                            <td className="border border-stone-600 px-4 py-2">{product.rate}</td>
                                            <td className="border border-stone-600 px-4 py-2">{product.total}</td>
                                            <td className="border border-stone-600 px-4 py-2">
                                                <button
                                                    onClick={() => handleDeleteProduct(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-right mb-4">
                            <h3 className="text-lg font-semibold">Total with GST: {calculateTotalWithGST().toFixed(2)}</h3>
                        </div>
                        <button
                            onClick={handleGenerateReceipt}
                            className="block w-full px-4 py-2 text-white bg-stone-700 rounded-md hover:bg-stone-800 focus:outline-none focus:bg-stone-800"
                        >
                            Generate Receipt
                        </button>
                    </>
                )}
            </div>

            <div className="max-w-xl mx-auto mt-8 px-4 bg-white rounded-md shadow-md p-6">
                <h1 className="text-2xl flex justify-center font-bold mb-4">Your Previous Receipts</h1>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-stone-600 mb-4">
                        <thead>
                            <tr>
                                <th className="border border-stone-600 px-4 py-2">Receipt ID</th>
                                <th className="border border-stone-600 px-4 py-2">Date</th>
                                <th className="border border-stone-600 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt) => (
                                <tr key={receipt._id}>
                                    <td className="border border-stone-600 px-4 py-2">{receipt._id}</td>
                                    <td className="border border-stone-600 px-4 py-2">{new Date(receipt.date).toLocaleDateString()}</td>
                                    <td className="border border-stone-600 px-4 py-2">
                                        <button
                                            onClick={() => handleDownloadReceipt(receipt)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReceipt(receipt._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AddProductPage;
