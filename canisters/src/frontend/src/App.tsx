import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: '',
    animation_url: '',
    external_url: '',
    attributes: [],
  });

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // Update the state with the fetched data
        setFormData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAttributeChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [field]: value,
      };
      return {
        ...prevData,
        attributes: updatedAttributes,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission, e.g., send data to server
    // fetch(url, {method, body})
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container">
      <h1>NFT Multichain Deployer</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="symbol">Symbol:</label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          {/* Additional Information */}
          <div className="form-group">
            <label htmlFor="animation_url">Animation URL:</label>
            <input
              type="text"
              id="animation_url"
              name="animation_url"
              value={formData.animation_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="external_url">External URL:</label>
            <input
              type="text"
              id="external_url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
            />
          </div>

          {/* Attributes */}
          <div className="form-group">
            <label>Attributes:</label>
            {formData.attributes.map((attr, index) => (
              <div key={index} className="attribute-group">
                <input
                  type="text"
                  placeholder="Trait Type"
                  value={attr.trait_type || ''}
                  onChange={(e) =>
                    handleAttributeChange(index, 'trait_type', e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={attr.value || ''}
                  onChange={(e) =>
                    handleAttributeChange(index, 'value', e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prevData) => ({
                  ...prevData,
                  attributes: [...prevData.attributes, { trait_type: '', value: '' }],
                }))
              }
            >
              Add Attribute
            </button>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
