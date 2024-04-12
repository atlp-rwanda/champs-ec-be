import { Request, Response } from "express";
import Role from "../models/Role";

// Create a new role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const newRole = await Role.create({ name });

    res.status(201).json({ message: "Role created successfully", newRole });
  } catch (error) {
    console.error("fail to create", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();

    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a role by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the role exists

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not" });
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if the role exists

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    await role.update({ name });

    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete a role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the role exists

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    await role.destroy();

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
