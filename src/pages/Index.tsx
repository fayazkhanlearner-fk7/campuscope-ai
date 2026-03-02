import { forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  return <div ref={ref} />;
});

Index.displayName = "Index";

export default Index;
