import BodyLayout from '@/components/bodyLayout';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()


  return (
    <BodyLayout>
    Hello
    </BodyLayout>
  );
}
