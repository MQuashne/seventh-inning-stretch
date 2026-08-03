def getsvg(id):

# The direct URL to the SVG file
  svg_url = "https://www.mlbstatic.com/team-logos/team-cap-on-dark/" + id + ".svg"
  output_filename = "/content/drive/MyDrive/svgs/dark/" + id + ".svg"

  try:
    # Send a GET request to the URL
    response = requests.get(svg_url, timeout=10)
    
    # Check if the request was successful (Status Code 200)
    if response.status_code == 200:
        # Open a local file in write-binary mode
        with open(output_filename, "wb") as file:
            file.write(response.content)
        print(f"Success! SVG saved as {output_filename}")
    else:
        print(f"Failed to download. Status code: {response.status_code}")

  except requests.exceptions.RequestException as e:
      print(f"An error occurred: {e}")
