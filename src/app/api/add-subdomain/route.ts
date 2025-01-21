import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Subdomain {
    subdomain: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { subdomain }: Subdomain = await request.json();

        if (!subdomain) {
            return NextResponse.json(
                { error: 'Subdomain is required' },
                { status: 400 }
            );
        }

        // Use the /tmp directory for storing the subdomains file
        const filePath = '/tmp/subdomains.json'; // Temporary file location in Vercel

        // Check if the file exists, if not, create it with an empty array
        let subdomains: Subdomain[] = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            subdomains = JSON.parse(fileData);
        } else {
            // If file doesn't exist, initialize with an empty array
            fs.writeFileSync(filePath, JSON.stringify(subdomains, null, 2));
        }

        // Add the new subdomain
        subdomains.push({ subdomain });

        // Write the updated list of subdomains back to /tmp/subdomains.json
        fs.writeFileSync(filePath, JSON.stringify(subdomains, null, 2));

        return NextResponse.json(
            { message: 'Subdomain added successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
