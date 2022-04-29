# API Documentation

## /create_materials_table

GET request to create the materials table.

## /delete_materials_table

GET request to delete the materials table.

## /materials (GET)

GET request to get all materials for construction_site_id.

Parameters:
    construction_site_id (uuid): The id of the construction site.

## /materials (POST)

POST request to create a new material.

    Parameters:
        name (string): The name of the material.
        volume (int): The volume of the material.
        cost (int): The cost of the material.
        color (string): The color of the material.
        delivery_date (string): The delivery date of the material.
        construction_site_id (uuid): The id of the construction site.

    HTTP Response:
        201: The material was created successfully.

## /materials (PUT)

PUT request to update a material.

    Parameters:
        id (uuid): The id of the material.
        name (string): The name of the material. Can't be changed.
        volume (int): The volume of the material.
        cost (int): The cost of the material.
        color (string): The color of the material.
        delivery_date (string): The delivery date of the material.
        construction_site_id (uuid): The id of the construction site.

    HTTP Response:
        200: The material was updated successfully.

## /materials/{id} (DELETE)

DEL request to delete a material.

    Parameters:
        construction_site_id (uuid): The id of the construction site.
        name (string): The name of the material.

    HTTP Response:
        200: The material was deleted successfully.

## /materials/total_cost (GET)

GET request to get the total cost of all materials for construction_site_id.

    Parameters:
        construction_site_id (uuid): The id of the construction site.

    Returns:
        The total cost of the materials.

## /construction_sites (GET)

    GET request to get all construction sites.

    Returns:
        A list of all construction sites.

## /seed 

    GET request to seed the database.

    HTTP Response:
        201: The database was seeded successfully.