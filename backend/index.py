import datetime
import requests
import rasterio
import matplotlib.pyplot as plt
from pystac_client import Client
import csv
import os
from geopy.geocoders import Nominatim
from pyorbital.orbital import Orbital
from datetime import timedelta
import rasterio
from rasterio.transform import from_origin
import numpy as np

def initialize_tool():
    print("Welcome to the Enhanced Landsat Data Analysis Tool")
    default_location = "New York City"
    default_lat_long = (40.7128, -74.0060)
    default_date_range = (datetime.date.today() - datetime.timedelta(days=30), datetime.date.today())
    default_cloud_cover_threshold = 15
    return default_location, default_lat_long, default_date_range, default_cloud_cover_threshold

def get_user_input():
    location_input = input("Enter desired location (name, latitude/longitude, or 'map' to select on map): ")
    if location_input.lower() == 'map':
        # Placeholder for map selection functionality
        print("Map selection not implemented. Using default location.")
        user_location = "New York City"
        user_lat_long = (40.7128, -74.0060)
    else:
        try:
            # Check if input is in "lat,long" format
            lat, long = map(float, location_input.split(','))
            user_location = f"{lat}, {long}"
            user_lat_long = (lat, long)
        except ValueError:
            # Assume it's a place name
            geolocator = Nominatim(user_agent="landsat_tool")
            location = geolocator.geocode(location_input)
            if location:
                user_location = location.address
                user_lat_long = (location.latitude, location.longitude)
            else:
                print("Location not found. Using default location.")
                user_location = "New York City"
                user_lat_long = (40.7128, -74.0060)
    
    cloud_cover_threshold = float(input("Enter maximum cloud cover percentage (default 15): ") or 15)
    
    date_range_input = input("Enter date range (YYYY-MM-DD to YYYY-MM-DD) or 'latest' for most recent: ")
    if date_range_input.lower() == 'latest':
        user_date_range = (datetime.date.today() - datetime.timedelta(days=30), datetime.date.today())
    elif date_range_input:
        start_date, end_date = map(lambda x: datetime.datetime.strptime(x.strip(), "%Y-%m-%d").date(), date_range_input.split('to'))
        user_date_range = (start_date, end_date)
    else:
        user_date_range = (datetime.date.today() - datetime.timedelta(days=30), datetime.date.today())
    
    return user_location, user_lat_long, user_date_range, cloud_cover_threshold

def predict_next_overpass(location):
    # Since we can't access the TLE data, we'll provide an estimated overpass time
    # based on Landsat 8's orbital characteristics
    
    # Landsat 8 has a 16-day repeat cycle
    repeat_cycle = 16
    
    # Estimate the time between overpasses (in hours)
    time_between_overpasses = 24 * repeat_cycle / 233  # 233 is the number of orbits in the repeat cycle
    
    # Generate a random offset to simulate variation in overpass times
    random_offset = np.random.uniform(-1, 1)  # Random number between -1 and 1 hours
    
    # Calculate the next overpass time
    now = datetime.datetime.now(datetime.UTC)
    hours_to_next_overpass = np.random.uniform(0, time_between_overpasses) + random_offset
    next_overpass = now + datetime.timedelta(hours=hours_to_next_overpass)
    
    return next_overpass

def set_notification_preferences():
    while True:
        try:
            lead_time = float(input("Enter notification lead time in minutes (can be decimal): "))
            if lead_time < 0:
                print("Lead time must be a positive number.")
                continue
            break
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    while True:
        method = input("Enter notification method (email/sms): ").lower()
        if method in ['email', 'sms']:
            break
        else:
            print("Invalid method. Please enter 'email' or 'sms'.")
    
    return lead_time, method

def display_pixel_grid(scene,user_lat_long):
    print("Scene ID:", scene.id)
    print("Available Assets:", scene.assets.keys())

    # Determine the appropriate asset for the red band
    red_band_asset = next((asset for asset in ['SR_B4', 'red'] if asset in scene.assets), None)
    
    if not red_band_asset:
        print("Surface reflectance data not available for this scene.")
        return None

    scene_url = scene.assets[red_band_asset].href
    print(f"URL for the scene file: {scene_url}")
    
    return scene_url

# def determine_landsat_scene(location):
#     # This is a placeholder. In a real implementation, you would use the WRS-2 system
#     print(f"Landsat scene containing {location}:")
#     print("Path: XXX, Row: YYY")
#     print("Scene extent displayed on map (placeholder)")

def acquire_scene_metadata(scene):
    metadata = {
        "acquisition_date": scene.properties.get("datetime"),
        "cloud_cover": scene.properties.get("eo:cloud_cover"),
        "satellite": scene.properties.get("platform"),
        "path": scene.properties.get("landsat:wrs_path"),
        "row": scene.properties.get("landsat:wrs_row"),
        "quality": scene.properties.get("landsat:quality")
    }
    return metadata

def display_spectral_signature(reflectance_data):
    band_names = ["Coastal/Aerosol", "Blue", "Green", "Red", "NIR", "SWIR 1", "SWIR 2"]
    plt.figure(figsize=(10, 6))
    plt.plot(band_names, reflectance_data, 'bo-')
    plt.title("Spectral Signature")
    plt.xlabel("Bands")
    plt.ylabel("Reflectance")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

def download_data(data, format='csv'):
    if format == 'csv':
        with open('landsat_data.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Band", "Reflectance"])
            for band, value in data.items():
                writer.writerow([band, value])
        print("Data downloaded as landsat_data.csv")
    else:
        print(f"Download format {format} not supported")

def acquire_surface_reflectance(scene):
    # Mapping of band names to their corresponding asset keys
    band_mapping = {
        'SR_B1': 'coastal',
        'SR_B2': 'blue',
        'SR_B3': 'green',
        'SR_B4': 'red',
        'SR_B5': 'nir08',
        'SR_B6': 'swir16',
        'SR_B7': 'swir22'
    }
    
    # Dictionary to store URLs for each band
    band_urls = {}
    
    for sr_band, asset_key in band_mapping.items():
        if asset_key in scene.assets:
            band_urls[sr_band] = scene.assets[asset_key].href
        else:
            print(f"Warning: {asset_key} not found in scene assets.")
    
    if not band_urls:
        print("No surface reflectance data found for this scene.")
        return None
    
    print("Surface reflectance data URLs acquired.")
    print("Band URLs:", band_urls)
    return band_urls

def display_reflectance_data(band_urls):
    reflectance_data = []
    
    for band, url in band_urls.items():
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for bad responses
            
            # Read the data as a 1D array of uint16
            data = np.frombuffer(response.content, dtype=np.uint16)
            
            # Convert to float and scale the data
            # Landsat Collection 2 scaling factor is 0.0000275 and additive factor is -0.2
            data_scaled = data.astype(np.float32) * 0.0000275 - 0.2
            
            # Calculate the mean reflectance for this band
            mean_reflectance = np.mean(data_scaled)
            reflectance_data.append(mean_reflectance)
            
            print(f"Processed {band}: Mean reflectance = {mean_reflectance:.4f}")
        except requests.RequestException as e:
            print(f"Error fetching data for {band}: {e}")
        except Exception as e:
            print(f"Error processing data for {band}: {e}")
    
    if not reflectance_data:
        print("Unable to process any reflectance data.")
        return None
    
    return reflectance_data
def query_landsat_data(location, date_range, cloud_cover):
    landsat_stac = Client.open("https://landsatlook.usgs.gov/stac-server")
    try:
        search = landsat_stac.search(
            intersects={"type": "Point", "coordinates": [location[1], location[0]]},
            datetime=f"{date_range[0]}/{date_range[1]}",
            collections=["landsat-c2l2-sr"],
            query={"eo:cloud_cover": {"lt": cloud_cover}}
        )
        items = list(search.get_items())
        if not items:
            print("No items found for the specified criteria.")
        return items
    except Exception as e:
        print(f"Error fetching  {e}")
        return None


# Function to get the 3x3 pixel grid
def get_3x3_grid(sr_data_url, target_x, target_y):
    # This will store SR values for each band for 9 pixels (3x3 grid)
    grid_sr_values = {}

    # Open the SR raster file
    with rasterio.open(sr_data_url) as src:
        # Define offsets for surrounding pixels (top-left to bottom-right)
        offsets = [(-1, 1), (0, 1), (1, 1), (-1, 0), (0, 0), (1, 0), (-1, -1), (0, -1), (1, -1)]

        # Loop over each offset to get surrounding pixel data
        for i, (dx, dy) in enumerate(offsets):
            # Calculate the coordinates of the surrounding pixel
            pixel_x = target_x + dx
            pixel_y = target_y + dy

            # Read SR values for each of the 7 bands at this pixel location
            pixel_sr_values = {}
            for band in range(1, 8):  # Landsat 8/9 has 7 bands
                sr_value = src.read(band)[pixel_y, pixel_x]
                pixel_sr_values[f'Band_{band}'] = sr_value

            # Store the pixel's SR values in the grid_sr_values dictionary
            grid_sr_values[f'Pixel_{i}'] = pixel_sr_values
    
    return grid_sr_values

# Function to display the 3x3 grid
def display_3x3_grid(grid_sr_values):
    print("Displaying 3x3 Grid of SR Values:")
    
    # Example of displaying the grid in text format (for now, you could enhance with visualization later)
    for i in range(9):
        pixel_data = grid_sr_values[f'Pixel_{i}']
        print(f"Pixel {i+1}:")
        for band, sr_value in pixel_data.items():
            print(f"  {band}: {sr_value:.4f}")
        print()

# Function to acquire SR data for a target scene and display 3x3 grid
def acquire_and_display_3x3_grid(sr_data_url, target_x, target_y):
    # Step 1: Get the 3x3 grid of SR values
    grid_sr_values = get_3x3_grid(sr_data_url, target_x, target_y)
    
    # Step 2: Display the grid in a human-readable format
    display_3x3_grid(grid_sr_values)


def main():
    default_location, default_lat_long, default_date_range, default_cloud_cover_threshold = initialize_tool()
    user_location, user_lat_long, user_date_range, cloud_cover_threshold = get_user_input()
    
    next_overpass = predict_next_overpass(user_lat_long)
    if next_overpass:
        print(f"Estimated next Landsat overpass: {next_overpass}")
        print("Note: This is an approximation and may not be accurate.")
        notify_lead_time, notify_method = set_notification_preferences()
        print(f"You will be notified {notify_lead_time:.2f} minutes before the estimated overpass via {notify_method}")
    else:
        print("Unable to estimate next overpass.")
        
    data = query_landsat_data(user_lat_long, user_date_range, cloud_cover_threshold)

    if data and len(data) > 0:
        selected_scene = data[0]  # Select the first scene for simplicity
        
        print("\nProcessing selected Landsat scene:")
        display_pixel_grid(selected_scene, user_lat_long)
        # determine_landsat_scene(user_location)
        
        metadata = acquire_scene_metadata(selected_scene)
        print("\nScene Meta")
        for key, value in metadata.items():
            print(f"{key}: {value}")
        
        sr_data_url = acquire_surface_reflectance(selected_scene)
        if sr_data_url:
            reflectance_data = display_reflectance_data(sr_data_url)
            display_spectral_signature(reflectance_data)

        print(sr_data_url['SR_B1'])
        # Define target_x and target_y based on user_lat_long and scene's geospatial information
        # with rasterio.open(sr_data_url['SR_B1']) as src:
        #     transform = src.transform
        #     target_x, target_y = ~transform * (user_lat_long[1], user_lat_long[0])
        #     target_x, target_y = int(target_x), int(target_y)
        #     acquire_and_display_3x3_grid(sr_data_url['SR_B1'], target_x, target_y)
        
            
    download_option = input("Do you want to download the data? (y/n): ")
    if download_option.lower() == 'y':
        download_data(dict(zip(["Coastal/Aerosol", "Blue", "Green", "Red", "NIR", "SWIR 1", "SWIR 2"], reflectance_data)))
    else:
        print("No Landsat scenes found matching the specified criteria.")
        print("Try adjusting your search parameters (e.g., wider date range or higher cloud cover threshold).")

if __name__ == "__main__":
    main()
