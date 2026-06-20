import { createSupabaseClient } from '../lib/supabase';

export interface DocumentTemplate {
    id: string;
    name: string;
    description?: string;
    file_path?: string;
    content_json?: any;
    created_by?: string;
    category?: string;
    is_system?: boolean;
    created_at?: string;
    updated_at?: string;
    roles?: TemplateRole[];
    fields?: TemplateField[];
}

export interface TemplateRole {
    id: string;
    template_id: string;
    role_name: string;
    signing_order: number;
    color: string;
}

export interface TemplateField {
    id: string;
    template_id: string;
    role_id: string;
    field_type: 'signature' | 'initials' | 'text' | 'date' | 'checkbox' | 'email' | 'company' | 'title' | 'stamp';
    page_number: number;
    position_x: number; // percentage (0-100)
    position_y: number; // percentage (0-100)
    width: number;
    height: number;
    is_required: boolean;
    placeholder?: string;
}

/**
 * Saves a new template along with its roles and pre-placed fields to Supabase.
 */
export async function saveCustomTemplate(
    token: string | undefined,
    templateData: {
        name: string;
        description?: string;
        file_path?: string;
        content_json?: any;
        userId?: string;
        category?: string;
    },
    roles: { role_name: string; signing_order: number; color: string }[],
    fields: {
        roleIndex: number; // index matching the roles array
        field_type: TemplateField['field_type'];
        page_number: number;
        position_x: number;
        position_y: number;
        width: number;
        height: number;
        is_required?: boolean;
        placeholder?: string;
    }[]
): Promise<{ success: boolean; data?: DocumentTemplate; error?: string }> {
    const supabase = createSupabaseClient(token);

    try {
        // 1. Insert template metadata
        const { data: tpl, error: tplErr } = await supabase
            .from('document_templates')
            .insert({
                name: templateData.name,
                description: templateData.description,
                file_path: templateData.file_path,
                content_json: templateData.content_json,
                created_by: templateData.userId,
                category: templateData.category || 'custom',
                is_system: false
            })
            .select()
            .single();

        if (tplErr) throw new Error(`Failed to create template: ${tplErr.message}`);

        // 2. Insert template roles
        const rolesToInsert = roles.map(r => ({
            template_id: tpl.id,
            role_name: r.role_name,
            signing_order: r.signing_order,
            color: r.color
        }));

        const { data: insertedRoles, error: rolesErr } = await supabase
            .from('template_roles')
            .insert(rolesToInsert)
            .select();

        if (rolesErr) throw new Error(`Failed to save template roles: ${rolesErr.message}`);

        // 3. Insert template fields (map roleIndex to actual role ID)
        if (fields.length > 0) {
            const fieldsToInsert = fields.map(f => {
                const matchedRole = insertedRoles[f.roleIndex];
                if (!matchedRole) throw new Error(`Invalid role index ${f.roleIndex} for template field`);
                return {
                    template_id: tpl.id,
                    role_id: matchedRole.id,
                    field_type: f.field_type,
                    page_number: f.page_number,
                    position_x: f.position_x,
                    position_y: f.position_y,
                    width: f.width,
                    height: f.height,
                    is_required: f.is_required !== false,
                    placeholder: f.placeholder || ''
                };
            });

            const { error: fieldsErr } = await supabase
                .from('template_fields')
                .insert(fieldsToInsert);

            if (fieldsErr) throw new Error(`Failed to save template fields: ${fieldsErr.message}`);
        }

        return { success: true, data: { ...tpl, roles: insertedRoles } };
    } catch (err: any) {
        console.error('Error saving custom template:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Fetches all templates for a user, including system templates.
 */
export async function fetchCustomTemplates(
    token: string | undefined,
    userId: string
): Promise<{ success: boolean; data: DocumentTemplate[]; error?: string }> {
    const supabase = createSupabaseClient(token);

    try {
        const { data: templates, error: tplErr } = await supabase
            .from('document_templates')
            .select('*')
            .or(`created_by.eq.${userId},is_system.eq.true`)
            .order('created_at', { ascending: false });

        if (tplErr) throw new Error(tplErr.message);

        if (!templates || templates.length === 0) {
            return { success: true, data: [] };
        }

        // Fetch roles and fields for these templates
        const templateIds = templates.map(t => t.id);

        const { data: roles, error: rolesErr } = await supabase
            .from('template_roles')
            .select('*')
            .in('template_id', templateIds);

        if (rolesErr) throw new Error(rolesErr.message);

        const { data: fields, error: fieldsErr } = await supabase
            .from('template_fields')
            .select('*')
            .in('template_id', templateIds);

        if (fieldsErr) throw new Error(fieldsErr.message);

        // Map roles and fields back to their templates
        const enrichedTemplates = templates.map(t => ({
            ...t,
            roles: roles?.filter(r => r.template_id === t.id) || [],
            fields: fields?.filter(f => f.template_id === t.id) || []
        }));

        return { success: true, data: enrichedTemplates };
    } catch (err: any) {
        console.error('Error fetching templates:', err);
        return { success: false, data: [], error: err.message };
    }
}

/**
 * Fetches a single template by ID with its roles and pre-placed fields.
 */
export async function getCustomTemplateById(
    token: string | undefined,
    templateId: string
): Promise<{ success: boolean; data?: DocumentTemplate; error?: string }> {
    const supabase = createSupabaseClient(token);

    try {
        const { data: template, error: tplErr } = await supabase
            .from('document_templates')
            .select('*')
            .eq('id', templateId)
            .single();

        if (tplErr) throw new Error(tplErr.message);

        const { data: roles, error: rolesErr } = await supabase
            .from('template_roles')
            .select('*')
            .eq('template_id', templateId);

        if (rolesErr) throw new Error(rolesErr.message);

        const { data: fields, error: fieldsErr } = await supabase
            .from('template_fields')
            .select('*')
            .eq('template_id', templateId);

        if (fieldsErr) throw new Error(fieldsErr.message);

        return {
            success: true,
            data: {
                ...template,
                roles: roles || [],
                fields: fields || []
            }
        };
    } catch (err: any) {
        console.error('Error getting template details:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Deletes a template by ID (triggers cascade delete on roles and fields).
 */
export async function deleteCustomTemplate(
    token: string | undefined,
    templateId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseClient(token);

    try {
        const { error } = await supabase
            .from('document_templates')
            .delete()
            .eq('id', templateId);

        if (error) throw new Error(error.message);

        return { success: true };
    } catch (err: any) {
        console.error('Error deleting custom template:', err);
        return { success: false, error: err.message };
    }
}
